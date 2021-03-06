const connection = require("../db/connection");

const checkArticleExists = article_id => {
  return connection
          .first("*")
          .from("articles")
          .where({article_id})
          .then(article => {
            if (article) return true;
            else return false;
          });
};

exports.countArticles = (author, topic) => {
  return connection("articles")
  .modify(query => {
    if (author) query.where({ "articles.author": author });
    if (topic) query.where({ "articles.topic": topic });
  })
  .then(articles => {
    return articles.length;
  })
}

exports.fetchArticles = (id, sort_by, order, author, topic, limit, p) => {
  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count({ comment_count: "comments.comment_id"})
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (id)
        query.where({ "articles.article_id": id }).select("articles.body");
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ "articles.topic": topic });
    })
    .limit(limit || 10)
    .offset(limit * (p-1) || 10 * (p-1))
    .then(articles => {
      if (articles.length === 0)
        return Promise.reject({
          status: 404,
          msg: "Route not found"
        });
      if ((!order || order === "asc" || order === "desc")&& (!limit || limit > 0)) {
        return articles;
      } else
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
    });
};

exports.updateArticle = (id, body) => {
  return connection("articles")
    .where("article_id", "=", id)
    .modify((query) => {
      if (body.inc_votes) query.increment("votes", body.inc_votes)
    })
    .then(() => {
      return exports.fetchArticles(id);
    });
};

exports.fetchCommentsByArticleId = (article_id, sort_by, order, limit, p) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .limit(limit || 10)
    .offset(limit * (p-1) || 10 * (p-1))
    .then(comments => {
      const articleExistsCheck = comments.length
        ? true
        : checkArticleExists(article_id);
      return Promise.all([comments, articleExistsCheck]);
    })
    .then(([comments, articleExists]) => {
      
      if (articleExists) {
        if ((!order || order === "asc" || order === "desc") && (!limit || limit > 0)) return comments;
          else
            return Promise.reject({
              status: 400,
              msg: "Bad request"
            });}
      else return Promise.reject({
        status:404,
        msg: "Route not found"
      })
    });
};

exports.insertComment = comment => {
  return connection
    .select("*")
    .from("comments")
    .insert(comment)
    .then(() => {
      return connection
        .select("comment_id", "author", "body", "votes", "created_at")
        .from("comments");
    });
};
