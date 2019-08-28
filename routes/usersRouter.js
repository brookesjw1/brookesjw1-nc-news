const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/usersControllers");
const { handle405s } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405s);

module.exports = usersRouter;
