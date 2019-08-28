const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsControllers");
const { handle405s } = require("../errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405s);

module.exports = topicsRouter;
