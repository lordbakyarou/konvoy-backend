const express = require("express");
const cors = require("cors");

//File imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");

//session based login
const session = require("express-session");
const TodoRouter = require("./Controllers/TodoController");
const isAuth = require("./Middlewares/isAuthMiddleware");
const mongodbsession = require("connect-mongodb-session")(session);

//constants
const app = express();
const PORT = process.env.PORT || 9000;
const store = new mongodbsession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlewares
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Replace with your frontend's origin
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true if using https in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.get("/check", (req, res) => {
  return res.send("WOrking");
});

app.use("/auth", AuthRouter);
app.use("/todo", isAuth, TodoRouter);

//express server
app.listen(PORT, () => {
  console.log(`Server is running at: ${PORT}`);
});
