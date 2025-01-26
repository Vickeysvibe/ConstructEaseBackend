import Notes from "../Models/Note.model.js";


export const createNote = async (req, res) => {
    try {
        const { title, sheetsLink, context, siteId } = req.body;

        
        const noteData = {
            title,
            sheetsLink: sheetsLink || null,
            context: sheetsLink ? null : context || null,
            siteId,
        };

        const newNote = new Notes(noteData);
        await newNote.save();

        res.status(201).json({ message: "Note created successfully", note: newNote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, sheetsLink, context } = req.body;


        const updatedData = {
            ...(title && { title }),
            sheetsLink: sheetsLink || null,
            context: sheetsLink ? null : context || null,
        };

        const updatedNote = await Notes.findByIdAndUpdate(noteId, updatedData, {
            new: true, 
        });

        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note updated successfully", note: updatedNote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllNotes = async (req, res) => {
    try {
        const { siteId } = req.query;

        if (!siteId) {
            return res.status(400).json({ message: "Site ID is required" });
        }

        const notes = await Notes.find({ siteId });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getNoteById = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Notes.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        const deletedNote = await Notes.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
