const express = require("express");
const TodoValidate = require("../Utils/TodoUtils");
const {
  createTodo,
  findTodoWithId,
  deleteTodo,
  editTodo,
  getAllTodo,
} = require("../Models/TodoModel");
const TodoSchema = require("../Schema/TodoSchema");
const TodoRouter = express.Router();

TodoRouter.get("/check", (req, res) => {
  return res.send("WOrking");
});

TodoRouter.post("/createTodo", async (req, res) => {
  const {
    todoName,
    todoDescription,
    todoStatus,
    todoPriority,
    todoCurrentAction,
  } = req.body;

  const todoCreatorId = req.session.user.userId;

  //Validating todo
  try {
    await TodoValidate({ todoName, todoDescription });
  } catch (error) {
    return res.status(error.status).json(error.message);
  }

  //Creating Todo
  try {
    const newTodo = await createTodo({
      todoName,
      todoDescription,
      todoCreatorId,
      todoStatus,
      todoPriority,
      todoCurrentAction,
    });

    return res.status(201).json(newTodo);
  } catch (error) {
    return res.status(error.status).json(error.message);
  }
});

TodoRouter.get("/getAllTodo", async (req, res) => {
  const userId = req.session.user.userId;
  console.log(req.session);

  try {
    const todos = await getAllTodo({ userId });
    console.log(todos.message);
    return res.status(todos.status).json(todos.message);
  } catch (error) {
    return res.status(error.status).json(error.message);
  }
});

TodoRouter.post("/getTodo", async (req, res) => {
  const todoId = req.body.todoId;

  try {
    const todo = await findTodoWithId({ todoId });
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(error.status).json(error.message);
  }
});

TodoRouter.post("/deleteTodo", async (req, res) => {
  const { todoId } = req.body;
  try {
    await findTodoWithId({ todoId });
    await deleteTodo({ todoId });
    return res.status(200).json("Todo Deleted");
  } catch (error) {
    return res.status(error.status).json(error.message);
  }
});

TodoRouter.post("/editTodo", async (req, res) => {
  const { todoId, updatedTodo } = req.body;

  try {
    await findTodoWithId({ todoId });
    const todo = await editTodo({ todoId, updatedTodo });
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(error.status).json(error.message);
  }
});

module.exports = TodoRouter;
