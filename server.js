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
  res.redirect("/stories");
});

app.get("/", (req, res) => {
  browse((err, stories) => {
    if (err) {
      return res.render(`error`, { err });
    }
    let templateVars = { oldStory: stories };
    res.render("stories", { stories });
  });
});

app.get(`/login/`, (req, res) => {
  res.redirect(`/stories`);
});

app.get("/stories", (req, res) => {
  let userId = req.params.userId;
  browse((err, stories) => {
    if (err) {
      return res.render(err, { err });
    }
    getStoryWithContributions(stories[0].id, (err, data) => {
      if (err) {
        return res.render("error", { err });
      }
      let helper = {
        truecheck: function checkCompleted(x) {
          if (Boolean(x) === true) {
            return "Completed";
          }
          return "in Progress";
        }
      };
      let userId = stories[0][`user_id`];
      res.cookie("userId", userId);
      res.render("stories", { stories, userId, data, helper });
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
      console.log(contribution);
      if (err) {
        return res.render("error", { err });
      }
      let helper = {
        truecheck: function checkCompleted(x) {
          if (Boolean(x) === true) {
            return "Completed";
          }
          return "in Progress";
        }
      };
      res.render("story", { story, contribution, helper });
    });
  });
});

app.get("/contribution", (req, res) => {
  res.render("contributions");
});

//-------------------------POST------------------------------------------
//Add story here
app.post(`/story`, (req, res) => {
  let { title, paragraph } = req.body;
  addStory(paragraph, title, err => {
    if (err) {
      return res.render("error", { err });
    }
    res.redirect("/stories");
  });
});

app.post("/story/completed/:id", (req, res) => {
  completeAStory(req.params.id, err => {
    if (err) {
      return res.render("error", { err });
    }
    res.redirect("/stories");
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
    res.render(`/stories`, { stories });
  });
});

app.post("/story/contribution", (req, res) => {
  addContributions(req.body.id, req.body.text, (err, data) => {
    if (err) {
      return res.render("error", { err });
    }
    res.redirect(`/story/${req.body.id}`);
  });
});
