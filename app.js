const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const { handleCustomErrors } = require('./errors/index')

app.use("/api", apiRouter);

app.all("/*", (req,res,next) => 
    next({status: 404, msg: 'Route not found'})
);

app.use(handleCustomErrors)

module.exports = app;
