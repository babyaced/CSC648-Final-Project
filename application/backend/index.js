require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const session = require("express-session");

//DB Connection
const connection = require("./db");

//Routes
const loginRouter = require("./routes/login.js");
const logoutRouter = require("./routes/logout.js");
const signupRouter = require("./routes/signup.js");

const searchRouter = require("./routes/search.js");

const dropdownRouter = require("./routes/dropdown-options.js");

const postRouter = require("./routes/post.js");
const feedRouter = require("./routes/feed.js");
const postsRouter = require("./routes/posts.js");

const commentRouter = require("./routes/comment.js");
const commentsRouter = require("./routes/comments.js");

const messageRouter = require("./routes/message.js");
const messagesRouter = require("./routes/messages.js");

const followRouter = require("./routes/follow.js");
const followsRouter = require("./routes/follows.js");

const petRouter = require("./routes/pet.js");
const petsRouter = require("./routes/pets.js");

const businessRouter = require("./routes/business.js");

const profileRouter = require("./routes/profile.js");

const resetPasswordRouter = require("./routes/reset-password.js");

const adminRouter = require("./routes/admin.js");

const likeRouter = require("./routes/like.js");

const app = express();

// const cors = require('cors');

//Session Store
const sessionStore = require("./session-store");

// app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    key: "userId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      expires: 60 * 60 * 24 * 1000, //1 day expiration
    },
  })
);

//start express server on port 5000
app.listen(5000, () => {
  //console.log("server started on port 5000");
});

//Sign Up
app.use("/api/signup", signupRouter);

//Login
app.use("/api/login", loginRouter);

//Logout
app.use("/api/logout", logoutRouter);

//Search
app.use("/api/search", searchRouter);

//Dropdown Options
app.use("/api/dropdowns", dropdownRouter);

//Create + Edit Post
app.use("/api/post", postRouter);
app.use("/api/posts", postsRouter);

//Feed
app.use("/api/feed", feedRouter);

//Get Comments
app.use("/api/comment", commentRouter);
app.use("/api/comments", commentsRouter);

//Get Messages
app.use("/api/message", messageRouter);
app.use("/api/messages", messagesRouter);

// Follow a user
app.use("/api/follow", followRouter);
app.use("/api/follows", followsRouter);

//Pets Lists
app.use("/api/pet", petRouter);
app.use("/api/pets", petsRouter);

//Profile
app.use("/api/profile", profileRouter);

//Business Profile Data and Edit Options
app.use("/api/business", businessRouter);

//Reset password
app.use("/api/password-reset", resetPasswordRouter);

//Admin Only Routes
app.use("/api/admin", adminRouter);

//Liking/unliking a post
app.use(likeRouter);
