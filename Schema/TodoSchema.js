const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema(
  {
    todoName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    todoDescription: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 1000,
    },
    todoCreatorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    todoStatus: {
      type: String,
      required: true,
    },
    todoPriority: {
      type: String,
      required: true,
    },
    todoCurrentAction: {
      type: String,
      required: true,
    },
    todoDuration: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("todo", TodoSchema);
