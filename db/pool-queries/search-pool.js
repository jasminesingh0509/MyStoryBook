const pool = require(`./pool-query`);

const browse = (cb) => {
  pool
    .query(`SELECT * FROM stories`)
    .then((res) => {
      cb(null, res.rows);
    })
    .catch((err) => cb(err));
};

const read = (id, cb) => {
  pool
    .query(`SELECT * FROM stories WHERE id = $1`, [ id ])
    .then((res) => {
      cb(null, res.rows[0]);
    })
    .catch((err) => cb(err));
};

const usersWithName = (name, cb) => {
  pool
    .query(`SELECT * FROM users WHERE name = $1`, [ name ])
    .then((res) => {
      cb(null, res.rows[0]);
    })
    .catch((err) => cb(err));
};

const getStory = (id, cb) => {
  // .text retrives the text from story object
  pool
    .query(`SELECT * FROM stories WHERE id = $1`, [ id ])
    .then((res) => {
      cb(null, res.rows[0]);
    })
    .catch((err) => cb(err));
};

const edit = (id, stories, cb) => {
  const sql = 'UPDATE stories SET text = $2 WHERE id = $1;';
  const args = [ id, stories ];
  pool
    .query(sql, args)
    .then(() => {
      cb(null, 'story updated succesfully');
    })
    .catch((err) => cb(err));
};

const getStoryByUser = function(id, cb) {
  return pool
    .query(
      `SELECT users.name, (stories.*)
From stories
Join users ON users.id = user_id
WHERE users.id = $1`,
      [ id ],
    )
    .then((res) => cb(res.rows[0]));
};

const addStory = function(story) {
  return pool.query(
    `INSERT INTO stories
(user_id, text, title, picture_url) values ($1, $2, $3, $4) RETURNING *`,
    [ stories.user_id, stories.text, stories.title, stories.picture_url ],
  );
};

// addStory({1,"hey there", 'TITLES STORY', 'www.google.ca'});

// const addToText = function(text, cb) {
//   return pool.query(
//     "INSERT INTO stories (text) VALUES ($1) WHERE user_id = 1;",
//     [text]
//   );
// };

// addToText("hey heyeh eyeyey", console.log);

const getStoryWithContributions = function(story) {
  // in object we will have to retrive the object keys for each text
  return pool
    .query(
      `SELECT stories.title as titles, stories.text as storytext, contributions.text as contributiontext
From contributions
Join stories on stories.id = story_id
WHERE stories.id = $1
ORDER BY contributions.order_by`,
      [ story ],
    )
    .then((res) => res.rows)
    .catch((err) => console.log(err));
};

const addContributionsToStory = function(story) {
  return pool.query(`INSERT INTO contributions (
  user_id, story_id, text, order_by) values($1, $2, $3, $4)`);
};
//getStoryWithContributions(1);

const getCompletedStory = function(cb) {
  return pool
    .query(
      `SELECT stories.title as titles, stories.text as storytext, contributions.text as contributiontext
FROM contributions
JOIN stories on stories.id = story_id
WHERE stories.is_completed = true
ORDER BY contributions.order_by`,
    )
    .then((res) => cb(res.rows));
};

const del = (id, cb) => {
  const sql = 'DELETE FROM stories WHERE id = $1;';
  const args = [ id ];
  pool
    .query(sql, args)
    .then(() => {
      cb(null, 'deleted sucessfully');
    })
    .catch((err) => cb(err));
};

const incomplete = function(cb) {
  return pool
    .query('SELECT stories.title, stories.text FROM stories where stories.is_completed = FALSE GROUP by stories.id')
    .then((res) => cb(res.rows));
};

const contributions = function() {
  return pool
    .query(
      'SELECT contributions.text, contributions.id, contributions.story_id From contributions JOIN stories on stories.id= story_id order by contributions.story_id;',
    )
    .then((res) => res.rows);
};

module.exports = {
  getCompletedStory,
  getStory,
  getStoryByUser,
  getStoryWithContributions,
  addStory,
  usersWithName,
  browse,
  read,
  edit,
  del,
  incomplete,
  contributions,
};
