import express from "express";
import {
  createTodo,
  getAllTodos,
  getTodoById,
  deleteTodo,
  updateTodo
} from "../Controllers/todo.contoller.js";

const router = express.Router();

router.post("/create-todo", createTodo);

router.get("/getall", getAllTodos);

router.put("/updatetodo",updateTodo);

router.get("/getbyid/:todoId", getTodoById);

router.delete("/delete/:todoId", deleteTodo);

export default router;
