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
  getStoryByUserId,
  del,
  getCompletedStory,
  incomplete,
  addStory,
  completeAStory,
  addContributions,
  getStoryWithContributions
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//----------------------------GET------------------------------

app.get("/", (req, res) => {
  res.redirect("/story");
});

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

app.get("/story", (req, res) => {
  let userId = req.params.userId;

  browse((err, stories) => {
    console.dir(stories);
    if (err) {
      return res.render(err, { err });
    }
    getStoryWithContributions(stories[0].id, (err, data) => {
      console.log("YASSSSSSSS");
      if (err) {
        return res.render("error", { err });
      }
      let userId = stories[0][`user_id`];
      res.cookie("userId", userId);
      res.render("stories", { stories, userId, data });
    });
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
  console.log(req.params.id);
  getStory(req.params.id, (err, story) => {
    if (err) {
      return res.render("error", { err });
    }
    getStoryWithContributions(req.params.id, (err, contribution) => {
      if (err) {
        return res.render("error", { err });
      }
      res.render("story", { story, contribution });
    });
  });
  //res.send('testing 4');
});

// app.get(`/story/:id`, (req, res) => {
//   read(req.params.id, (err, stories) => {
//     if (err) {
//       res.render("error", { err });
//     }
//     res.render("story", { stories });
//   });
//   //res.send('testing 4');
// });

app.get(`/user/:id`, (req, res) => {
  getStoryByUserId(req.params.id, (err, stories) => {
    if (err) {
      return res.render("error", { err });
    }
    //console.log(`stories`, req.params.id);
    res.render(`stories`, { stories });
  });
});

app.get("/contribution", (req, res) => {
  res.render("contributions");
});

//-------------------------POST------------------------------------------
//Add story here
app.post(`/story`, (req, res) => {
  let { title, text } = req.body;
  addStory(title, text, err => {
    if (err) {
      return res.render("error", { err });
    }
  });
});

app.post("/story/completed", (req, res) => {
  completeAStory(err => {
    if (err) {
      return res.render("error", { err });
    }
  });
});

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

app.post("/story/contribution", (req, res) => {
  addContributions(req.body.id, req.body.text, (err, data) => {
    if (err) {
      return res.render("error", { err });
    }
    res.send("contribution added success!");
  });
});
