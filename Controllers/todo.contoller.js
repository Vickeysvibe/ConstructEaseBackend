import Todos from "../Models/Todos.model.js";
import Sites from "../Models/Sites.model.js";

export const createTodo = async (req, res) => {
    try {
        const { task, start, end, additionalCols } = req.body;
        const { siteId } = req.query;

        const site = await Sites.findById(siteId);
        if (!site) {
            return res.status(404).json({ message: "Site not found" });
        }

        const newTodo = new Todos({
            task,
            start,
            end,
            additionalCols: additionalCols || {},
            siteId,
        });

        await newTodo.save();
        res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: error.message,redirectUrl: 'http://.....'  });
    }
};

export const getAllTodos = async (req, res) => {
    try {
        const { siteId } = req.query;

        if (!siteId) {
            return res.status(400).json({ message: "siteId is required in the query" });
        }

        const todos = await Todos.find({ siteId }).populate("siteId", "siteName siteAddress");
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message ,redirectUrl: 'http://.....' });
    }
};

export const getTodoById = async (req, res) => {
    try {
        const { todoId } = req.params;
        const todo = await Todos.findById(todoId).populate("siteId", "siteName siteAddress");

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message,redirectUrl: 'http://.....'  });
    }
};


export const updateTodo = async (req, res) => {
    try {
        const { todoId } = req.params; 
        const { task, start, end, additionalCols } = req.body; 

        
        const updatedTodo = await Todos.findByIdAndUpdate(
            todoId,
            {
                $set: {
                    ...(task && { task }), 
                    ...(start && { start }),
                    ...(end && { end }),
                    ...(additionalCols && { additionalCols }), 
                },
            },
            { new: true } 
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo updated successfully", todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteTodo = async (req, res) => {
    try {
        const { todoId } = req.params;
        const deletedTodo = await Todos.findByIdAndDelete(todoId);

        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message,redirectUrl: 'http://.....'  });
    }
};
