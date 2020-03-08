// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const app = express();
const morgan = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  '/styles',
  sass({
    src: __dirname + '/styles',
    dest: __dirname + '/public/styles',
    debug: true,
    outputStyle: 'expanded',
  }),
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require('./routes/users');
const widgetsRoutes = require('./routes/widgets');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use('/api/users', usersRoutes(db));
app.use('/api/widgets', widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get('/story', (req, res) => {
  res.send('sup dude');
});
app.get('/story/progress', (req, res) => {
  res.send('baby authentic meggings');
});

app.get(`/story/completed`, (req, res) => {
  res.send(
    `I'm baby authentic meggings officia palo santo schlitz commodo ad letterpress hella af glossier everyday carry before they sold out slow-carb helvetica. Vexillologist banh mi kickstarter freegan celiac la croix, adipisicing esse. Laborum bitters duis leggings photo booth retro chia, forage portland blue bottle glossier. Tumeric slow-carb lorem vaporware retro. Tote bag enamel pin pitchfork hammock small batch man bun whatever pok pok tattooed ipsum.`,
  );
});
app.get(`/story/:age`, (req, res) => {
  res.send('im 12 and what is this?');
});
app.get(`/story/:id`, (req, res) => {
  res.send('testing 4');
});
app.get(`/user/:id`, (req, res) => {
  res.send('samesame');
});
app.post(`/user`, (req, res) => {});
app.post(`/user/:id`, (req, res) => {});
app.post(`/story/delete`, (req, res) => {});
app.post(`/logout`, (req, res) => {});
//no login page, but login route
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
//watch funfunfunction for higher order function filter usage
