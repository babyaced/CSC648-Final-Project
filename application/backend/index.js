require('dotenv').config({path:__dirname+'/.env'})

console.log(process.env.DB_HOST),
console.log(process.env.DB_USER),
console.log(process.env.DB_PASSWORD),
console.log(process.env.DB_NAME)
const express = require("express");

const session = require('express-session');

//DB Connection
const connection = require('./db');

//Routes
const loginRouter = require('./routes/login.js');
const logoutRouter = require('./routes/logout.js');
const signupRouter = require('./routes/sign-up.js');
const searchRouter = require('./routes/search.js');
const dropdownRouter = require('./routes/dropdown-options.js');
const uploadPostRouter = require('./routes/upload-post.js');
const editPostRouter = require('./routes/edit-post.js');
const feedRouter = require('./routes/feed.js');
const commentsRouter = require('./routes/comments.js');
const followUserRouter = require('./routes/follow-unfollow-user.js');
const petsRouter = require('./routes/pets.js');
const likeRouter = require('./routes/like.js')
const profileRouter = require('./routes/profile.js');
const profileEditRouter = require('./routes/edit-profile.js');
const petProfileRouter = require('./routes/pet-profile.js');
const businessProfileRouter = require('./routes/business-profile.js')
const resetPasswordRouter = require('./routes/reset-password.js')
const adminRouter = require('./routes/admin.js')
const resetRouter = require('./routes/reset.js')
const messagesRouter = require('./routes/messages.js')
const postsRouter = require('./routes/posts.js')

const app = express();

// const cors = require('cors');

//Session Store
const sessionStore = require('./session-store');



// app.use(cookieParser());

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(session({
     key: "userId",
     secret: "zooble",
     resave: false,
     saveUninitialized: false,
     store: sessionStore,
     cookie: {
         expires: 60 * 60 * 24 * 1000, //1 day expiration
     }
 }))


//start express server on port 5000
app.listen(5000, () =>{
    console.log("server started on port 5000");
});

//Sign Up
app.use(signupRouter);

//Login
app.use(loginRouter);

//Logout
app.use(logoutRouter);

//Search
app.use(searchRouter);

//Dropdown Options
app.use(dropdownRouter)

//Upload Post
app.use(uploadPostRouter)

//Edit Post
app.use(editPostRouter)

//Feed
app.use(feedRouter);

//Insert, Get Comments
app.use(commentsRouter);

//send messages
app.use(messagesRouter);


// Follow a user
app.use(followUserRouter);

//Pets Lists
app.use(petsRouter);

//Liking/unliking a post
app.use(likeRouter)

//Profile
app.use(profileRouter)

//Profile edit options
app.use(profileEditRouter)

//Pet Profile Data and Edit options
app.use(petProfileRouter)

//Business Profile Data and Edit Options
app.use(businessProfileRouter)

//Reset password
app.use(resetPasswordRouter)

//Reset password
app.use(resetRouter)
app.use(adminRouter)

app.use(postsRouter)












