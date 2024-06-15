const { model } = require("mongoose");
const validator = require("validator");

const validateSignupUserData = ({ username, email, name, password }) => {
  return new Promise((res, rej) => {
    if (!username || !name || !email || !password) {
      rej("User Data is missing");
    }

    if (!validator.isEmail(email)) {
      rej("Please enter valid email");
    }

    if (!validator.isStrongPassword(password)) {
      rej("Please create stronge password");
    }

    if (typeof username != "string") rej("Username must be string");
    if (typeof email != "string") rej("Email must be string");
    if (typeof password != "string") rej("Password must be string");

    if (username.length < 3 || username.length > 50)
      rej("Length of username must be 3-50 characters");
    if (password.length < 3 || password.length > 50)
      rej("Length of password must be 3-50 characters");

    if (!validateEmail(email)) rej("Please enter valid email");

    res("Singup successfully");
  });
};

const validateLoginData = ({ loginId, password }) => {
  return new Promise((res, rej) => {
    // console.log(typeof loginId, typeof password);
    if (typeof loginId != "string") rej("Please enter valid loginId");
    if (typeof password != "string") rej("Please enter password");

    res("Login details are correct");
  });
};

function validateEmail(userEmail) {
  let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
  let result = regex.test(userEmail);
  return result;
}

module.exports = { validateSignupUserData, validateLoginData };
