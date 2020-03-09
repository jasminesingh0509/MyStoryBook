/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
//const { browse } = require('../db/pool-queries');
const db = require('../db/pool-queries/pool-query');
module.exports = (db) => {
  router.get('/', (req, res) => {
    db
      .query(`SELECT * FROM stories;`)
      .then((data) => {
        const stories = data.rows;
        res.render(stories, { stories });
      })
      .catch((err) => {
        res.render(err, { err });
      });
  });
  return router;
};
