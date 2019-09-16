const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const { handleCustomErrors, handle400s, handle422s } = require('./errors/index');
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req,res,next) => 
    next({status: 404, msg: 'Route not found'})
);

app.use(handleCustomErrors)
app.use(handle400s)
app.use(handle422s)

module.exports = app;
