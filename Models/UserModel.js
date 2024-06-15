const UserSchema = require("../Schema/UserSchema");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));

const Signup = ({ username, email, name, password }) => {
  return new Promise(async (res, rej) => {
    const hashPassword = bcrypt.hashSync(password, salt);

    try {
      const userObj = new UserSchema({
        name,
        email,
        username,
        password: hashPassword,
      });

      await userObj.save();

      res(userObj);
    } catch (error) {
      rej(error);
    }
  });
};

const IfUserExist = ({ email, username }) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await UserSchema.findOne({
        $or: [{ email }, { username }],
      });
      if (user?.email === email) rej("Email already exist");
      if (user?.username === username) rej("Username already exist");

      res();
    } catch (error) {
      rej(error);
    }
  });
};

const FindUserWithLoginId = ({ loginId }) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await UserSchema.findOne({
        $or: [{ email: loginId }, { username: loginId }],
      }).select("+password");

      if (!user) rej("User not found");

      res(user);
    } catch (error) {
      rej(error);
    }
  });
};

const CheckIfUserExist = ({ userId }) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await UserSchema.findOne({ _id: userId });
      if (!user)
        rej({ message: `User does not exist: ${userId}`, status: 404 });

      res(user);
    } catch (error) {
      rej(error);
    }
  });
};

module.exports = { Signup, IfUserExist, FindUserWithLoginId, CheckIfUserExist };
