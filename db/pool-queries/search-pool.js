const pool = require(`./pool-query`);

const browse = cb => {
  pool
    .query(`SELECT * FROM stories`)
    .then(res => {
      cb(null, res.rows);
    })
    .catch(err => cb(err));
};

const read = (id, cb) => {
  pool
    .query(`SELECT * FROM stories WHERE id = $1`, [id])
    .then(res => {
      cb(null, res.rows[0]);
    })
    .catch(err => cb(err));
};

const usersWithName = (name, cb) => {
  pool
    .query(`SELECT * FROM users WHERE name = $1`, [name])
    .then(res => {
      cb(null, res.rows[0]);
    })
    .catch(err => cb(err));
};

const getStory = (id, cb) => {
  // .text retrives the text from story object
  pool
    .query(`SELECT * FROM stories WHERE id = $1`, [id])
    .then(res => {
      cb(null, res.rows[0]);
    })
    .catch(err => cb(err));
};

const getStoryByUserId = function(id, cb) {
  pool
    .query(
      `SELECT users.name, (stories.*)
From stories
Join users ON users.id = user_id
WHERE users.id = $1`,
      [id]
    )
    .then(res => cb(null, res.rows[0]))
    .catch(err => cb(err, null));
};

//dont touch this one it works hard coded user_id =1
const addStory = function(title, text, cb) {
  const sql = `INSERT INTO stories
(user_id, text, title, created_at, updated_at) values (1, $1, $2, NOW(), NOW())`;
  const args = [title, text];
  pool
    .query(sql, args)
    .then(() => {
      cb(null, "added successfully");
    })
    .catch(err => cb(err, null));
};

const getStoryWithContributions = function(story_id, cb) {
  // in object we will have to retrive the object keys for each text
  pool
    .query(
      `SELECT stories.id as id, stories.title as titles, stories.text as storytext, contributions.text as contributiontext, users.name as name
From contributions
Join users on users.id = user_id
RIGHT Join stories on stories.id = story_id
WHERE stories.id = $1
ORDER BY contributions.order_by`,
      [story_id]
    )
    .then(res => cb(null, res.rows))
    .catch(err => cb(err, null));
};

const addContributions = function(story_id, text, cb) {
  pool
    .query(
      `INSERT INTO contributions (
  user_id, story_id, text, order_by) values(1, $1, $2, 3)`,
      [Number(story_id), text]
    )
    .then(res => cb(null, res.rows))
    .catch(err => cb(err, null));
};
//getStoryWithContributions(1);

const getCompletedStory = function(cb) {
  pool
    .query(
      `SELECT stories.title as titles, stories.text as storytext, contributions.text as contributiontext
FROM contributions
JOIN stories on stories.id = story_id
WHERE stories.is_completed = true
ORDER BY contributions.order_by`
    )
    .then(res => cb(res.rows));
};

//THIS WORKS DONT TOUCH
const del = (id, cb) => {
  const sql = "DELETE FROM stories WHERE id = $1;";
  const args = [id];
  pool
    .query(sql, args)
    .then(() => {
      cb(null, "deleted sucessfully");
    })
    .catch(err => cb(err));
};

const incomplete = function(cb) {
  pool
    .query(
      "SELECT stories.title, stories.text FROM stories where stories.is_completed = FALSE GROUP by stories.id"
    )
    .then(res => cb(res.rows));
};

const completeAStory = function(id, cb) {
  pool
    .query("UPDATE stories SET is_completed = true WHERE stories.id = $1;", [
      id
    ])
    .then(res => cb(null, res.rows))
    .catch(err => cb(err));
};

const getContributionsWithStoryID = function(cb) {
  pool
    .query(
      "SELECT contributions.text, contributions.id, contributions.story_id From contributions JOIN stories on stories.id= story_id order by contributions.story_id;"
    )
    .then(res => cb(res.rows));
};

module.exports = {
  getCompletedStory,
  getStory,
  getStoryByUserId,
  getStoryWithContributions,
  addStory,
  usersWithName,
  browse,
  read,
  del,
  incomplete,
  getContributionsWithStoryID,
  addContributions,
  completeAStory
};
