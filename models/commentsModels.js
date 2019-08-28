const connection = require("../db/connection");

exports.updateComment = (comment_id, body) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", body.inc_votes)
    .then(() => {
      return connection
        .select("comments.author",
        "articles.title", "comments.votes", "comments.created_at", "comments.body")
        .from("comments")
        .join("articles", "comments.article_id", "articles.article_id")
        .where("comment_id", "=", comment_id);
    });
};
