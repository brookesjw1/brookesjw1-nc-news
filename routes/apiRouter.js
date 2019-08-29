const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const { handle405s } = require("../errors");
const { getAllEndpoints } = require('../controllers/apiControllers')

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter
  .route("/")
  .get(getAllEndpoints)
  .all(handle405s);

module.exports = apiRouter;
