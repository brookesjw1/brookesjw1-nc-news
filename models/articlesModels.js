const connection = require("../db/connection");

exports.fetchArticles = (id, {sort_by, order, author, topic}) => {
  return connection
    .select("articles.author",
    "articles.title", "articles.article_id", "articles.topic", "articles.created_at", "articles.votes")
    .count({ comment_count: "comments.comment_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify((query) => {
      if (id) query.where({ "articles.article_id": id }).select("articles.body");
      if (author) query.where({"articles.author": author});
      if (topic) query.where({"articles.topic": topic});
    })
    .then(articles => {
      if (articles.length === 0)
        return Promise.reject({
          status: 404,
          msg: "article not found"
        });
      return articles.map(article => {
        return {
          ...article,
          comment_count: +article.comment_count
        };
      });
    });
};

exports.updateArticle = (id, body, query) => {
  return connection("articles")
    .where("article_id", "=", id)
    .increment("votes", body.inc_votes)
    .then(() => {
      if (!body.inc_votes || Object.keys(body).length > 1)
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
        // is there a way of not passing through a query??????
      return exports.fetchArticles(id, query);
    });
};

exports.fetchCommentsByArticleId = (article_id, {sort_by, order }) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || 'created_at', order || "desc");
};

exports.insertComment = (comment, articleId) => {
  return (
    connection
      .select("*")
      .from("comments")
      .insert({
        "author": comment.username,
        "article_id": articleId,
        "body": comment.body
      })
      .returning("*")
  );
};
