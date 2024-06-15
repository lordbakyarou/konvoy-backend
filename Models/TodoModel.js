const TodoSchema = require("../Schema/TodoSchema");

const createTodo = ({
  todoName,
  todoDescription,
  todoCreatorId,
  todoStatus,
  todoPriority,
  todoCurrentAction,
}) => {
  return new Promise(async (res, rej) => {
    try {
      const todoObject = new TodoSchema({
        todoName,
        todoDescription,
        todoCreatorId,
        todoStatus,
        todoPriority,
        todoCurrentAction,
      });

      const newTodo = await todoObject.save();
      res(newTodo);
    } catch (error) {
      rej({ message: error, status: 500 });
    }
  });
};

const findTodoWithId = ({ todoId }) => {
  return new Promise(async (res, rej) => {
    try {
      const todo = await TodoSchema.findOne({ _id: todoId });
      if (todo) res(todo);
      else rej({ message: "No todo found", status: 404 });
    } catch (error) {
      rej({ message: error, status: 500 });
    }
  });
};

const getAllTodo = ({ userId }) => {
  return new Promise(async (res, rej) => {
    try {
      const todos = await TodoSchema.find({ todoCreatorId: userId });
      if (todos.length < 0) rej({ message: "No todo found", status: 404 });
      res({ message: todos, status: 200 });
    } catch (error) {
      rej({ message: error, status: 500 });
    }
  });
};

const editTodo = ({ todoId, updatedTodo }) => {
  return new Promise(async (res, rej) => {
    try {
      const todo = await TodoSchema.findOne({ _id: todoId });
      if (!todo) {
        rej({ message: "Todo not found", status: 404 });
      }

      for (let key in updatedTodo) {
        if (todo[key] != undefined) {
          todo[key] = updatedTodo[key];
        }
      }

      await todo.save();
      console.log(todo);

      res({ message: todo, status: 200 });
    } catch (error) {
      rej({ message: error, status: 500 });
    }
  });
};

const deleteTodo = ({ todoId }) => {
  return new Promise(async (res, rej) => {
    try {
      await TodoSchema.findOneAndDelete({ _id: todoId });
      res("Todo deleted");
    } catch (error) {
      rej({ message: error, status: 500 });
    }
  });
};

module.exports = {
  createTodo,
  findTodoWithId,
  deleteTodo,
  editTodo,
  getAllTodo,
};
