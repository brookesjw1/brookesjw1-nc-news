const connection = require("../db/connection");

exports.updateComment = (comment_id, body) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", body.inc_votes)
    .then((incCount) => {
      if (incCount === 0) return Promise.reject({
        status:404,
        msg: "Route not found"
      });
      return connection
        .select("comments.author",
        "articles.title", "comments.votes", "comments.created_at", "comments.body")
        .from("comments")
        .join("articles", "comments.article_id", "articles.article_id")
        .where("comment_id", "=", comment_id);
    });
};

exports.removeComment = comment_id => {
    return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then((delCount) =>{
      if (delCount === 0) return Promise.reject({
        status: 404,
        msg: "Route not found"
      })
      else return delCount;
    });
}