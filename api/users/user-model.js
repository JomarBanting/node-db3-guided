const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

async function findPosts(user_id) {
  const result = await db("posts").select("posts.id as post_id", "posts.contents as contents", "users.username as username")
                  .join("users", "posts.user_id", "=" ,"users.id").where("users.id", user_id);
  return result;
  /*
    raw = 
    select posts.id as post_id, posts.contents, users.username
    from posts join users
    on posts.user_id = users.id;

    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

function find() {
  return db('users')
  .leftJoin("posts", "posts.id", "users.id")
  .groupBy("users.id")
  .select("users.id as user_id", "users.username")
  .count("posts.id as post_count");
  /*
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  const rows = await db('users')
  .leftJoin("posts", "posts.id", "users.id")
  .select("users.id as user_id", "users.username")
  .where("users.id", id);

  const contents = await db("posts")
  .select("posts.id as post_id","posts.contents")
  .where("posts.user_id", id);

  rows[0]["posts"] = contents;
  return rows;
  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
