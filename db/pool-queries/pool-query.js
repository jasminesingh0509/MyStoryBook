const { Pool } = require(`pg`);
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm',
});
module.exports = pool;

const usersWithName = function(name) {
  return pool
    .query(
      `
  SELECT * FROM users
  WHERE name = $1
  `,
      [ name ],
    )
    .then((res) => res.rows[0]);
};

/* const usersWithNames = function() {
  return (
    pool
      .query(
        `
  SELECT * FROM users
  `,
      )
      // .then((res) => res.rows[0]);
      .then((res) => console.log(res.rows))
  );
};
 */
const getStory = function(id) {
  return pool
    .query(
      `SELECT * FROM stories
  WHERE id = 1`,
    )
    .then((res) => console.log(res));
};

console.log(getStory(1));
