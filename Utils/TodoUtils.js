const TodoValidate = ({ todoName, todoDescription }) => {
  console.log(todoName, todoDescription);

  return new Promise((res, rej) => {
    if (!todoName || !todoDescription)
      rej({ message: "Please enter all required field", status: 400 });

    if (todoName.length < 3 || todoName.length > 100) {
      rej({
        message: "TItle length must be between 3 - 100 characters",
        status: 400,
      });
    }

    if (todoDescription.length < 3 || todoDescription.length > 1000)
      rej({
        message: "Text body length must be between 3 - 1000 characters",
        status: 400,
      });

    res("Everything working fine");
  });
};

module.exports = TodoValidate;
