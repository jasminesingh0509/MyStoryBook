require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const pool = require("../MyStoryBook/db/pool-queries/pool-query");
const {
  getStory,
  browse,
  getStoryByUser,
  del,
  getCompletedStory,
  incomplete
} = require("../MyStoryBook/db/pool-queries/search-pool");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
app.use(express.static("public"));
app.use(cookieParser());

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
const users = {};
const stories = {};

app.get("/", (req, res) => {
  browse((err, stories) => {
    if (err) {
      return res.render(`error`, { err });
    }
    res.render("stories", { stories });
  });
});

app.get(`/login/`, (req, res) => {
  res.redirect(`/story`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/story", (req, res) => {
  let userId = req.params.userId;
  console.log(userId);
  browse((err, stories) => {
    if (err) {
      return res.render(err, { err });
    }
    let userId = stories[0][`user_id`];
    res.cookie("userId", userId);
    res.render("index", { stories, userId });
  });
});

app.get("/story/progress", (req, res) => {
  incomplete((err, stories) => {
    if (err) {
      return res.render(err, { err });
    }
    res.render("stories", { stories });
  });
});

app.get(`/story/completed`, (req, res) => {
  getCompletedStory((err, stories) => {
    if (err) {
      return res.render(err, { err });
    }
    res.render("stories", { stories });
  });
});

app.get(`/story/:id`, (req, res) => {
  getStory(req.params.id, (err, stories) => {
    if (err) {
      return res.render("error", { err });
    }
    res.render("stories", stories);
  });
  //res.send('testing 4');
});

app.get(`/user/:id`, (req, res) => {
  getStoryByUser(req.params.id, (err, stories) => {
    if (err) {
      return res.render("error", { err });
    }
    //console.log(`stories`, req.params.id);
    res.render(`stories`, { stories });
  });
});

//Add story here
// app.post(`/story`, (req, res) => {
//   let { story, paragraph } = req.body;
//   console.log(`storytext test in post`);
//   (req.params.id, (err, stories) => {
//     if (err) {
//       return res.render("error", { err });
//     }
//     res.render("stories", { stories });
//   });
// });

//DELETE POST
app.post(`/story/:id/delete`, (req, res) => {
  let deleteId = req.params.id;
  del(deleteId, (err, stories) => {
    if (err) {
      return res.render("error", { err });
    }
    //console.log(`stories`, req.params.id);
    res.render(`stories`, { stories });
  });
});

// story
// put contribution
// get/story/completed
//get/story/progress
//get/story/age
//get/story/id
// post/user
// post/user/id
// post/story/delete
// post/logout
