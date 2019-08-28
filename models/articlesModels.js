const connection = require("../db/connection");

exports.fetchArticleById = id => {
  return connection
    .select("articles.*")
    .count({ comment_count: "comments.comment_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": id })
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

exports.updateArticle = (body, id) => {
  return connection("articles")
    .where("article_id", "=", id)
    .increment("votes", body.inc_votes)
    .then(() => {
      if (!body.inc_votes || Object.keys(body).length > 1)
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      return this.fetchArticleById(id)
    })
};
