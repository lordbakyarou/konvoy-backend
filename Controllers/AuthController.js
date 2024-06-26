const express = require("express");
const bcrypt = require("bcryptjs");

//File imports
const {
  validateSignupUserData,
  validateLoginData,
} = require("../Utils/AuthUtils");
const {
  Signup,
  IfUserExist,
  FindUserWithLoginId,
  CheckIfUserExist,
} = require("../Models/UserModel");
const isAuth = require("../Middlewares/isAuthMiddleware");

//Router
const AuthRouter = express.Router();

AuthRouter.post("/signup", async (req, res) => {
  const { name, email, password, username } = req.body;

  try {
    //validating the user data from the client

    await validateSignupUserData({ username, email, name, password });
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    //validating is user exist or not
    await IfUserExist({ email, username });

    await Signup({ username, email, name, password });

    return res.status(201).json("Signup succesfull");
  } catch (error) {
    return res.status(500).json(error);
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  try {
    await validateLoginData({ loginId, password });
  } catch (error) {
    res.status(400).json(error);
  }

  try {
    const userData = await FindUserWithLoginId({ loginId });

    const isMatch = bcrypt.compareSync(password, userData.password);

    if (!isMatch) {
      return res.status(400).json("Please enter correct password");
    }

    req.session.isAuth = true;
    req.session.user = {
      userId: userData._id,
      username: userData.username,
      email: userData.email,
      name: userData.name,
    };

    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json(error);
  }
});

AuthRouter.get("/logout", isAuth, (req, res) => {
  req.session.isAuth = false;

  //Deleting the session
  req.session.destroy((err) => {
    if (err) return res.status(400).json(err);
    return res.send("User logged out");
  });
});

AuthRouter.get("/check", isAuth, (req, res) => {
  return res.send("working fine");
});

module.exports = AuthRouter;
