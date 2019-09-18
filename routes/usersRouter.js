const usersRouter = require("express").Router();
const { getUserByUsername, getUsers } = require("../controllers/usersControllers");
const { handle405s } = require("../errors");

usersRouter
  .route("/")
  .get(getUsers)
  .all(handle405s);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405s);

module.exports = usersRouter;
