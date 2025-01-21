import {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from "../Controllers/Notes.controller.js";

router.post("/createnotes", createNote); 
router.get("/getnotes", getAllNotes); 
router.get("/getnotesid/:noteId", getNoteById); 
router.put("/updatenotes/:noteId", updateNote); 
router.delete("/deletenotes/:noteId", deleteNote); 
