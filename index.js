const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

// Middleware to allow any origin
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     return res.status(200).json({});
//   }
//   next();
// });

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Your frontend URL
    credentials: true, // Allow credentials (cookies, headers)
  })
);

app.use(express.json());

// app.use(
//   session({
//     secret: process.env.SECRET_KEY, // Replace with your secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       httpOnly: true,
//       secure: false, // Set to true if using HTTPS in production
//       sameSite: "lax", // Adjust based on your needs (None, Strict, or Lax)
//     },
//   })
// );

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    proxy: true,
    cookie: {
      httpOnly: true,
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
