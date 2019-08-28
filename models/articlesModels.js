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

exports.updateArticle = (inc_votes, id) => {
  return connection("articles")
    .where("article_id", "=", id)
    .increment("votes", inc_votes)
    .then(() => {
      if (!inc_votes)
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      return connection("articles")
        .select("*")
        .where("article_id", "=", id);
    })
    .then(article => {
      // why does this not generate an error if there is no article???
      if (!article[0])
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      else return article[0];
    });
};
