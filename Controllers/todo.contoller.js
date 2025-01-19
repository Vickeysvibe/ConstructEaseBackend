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

