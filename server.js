const express = require("express");

const userRouter = require("./users/userRouter.js");

const server = express();

//custom middleware
function logger(req, res, next) {
  const timestamp = new Date().toString();
  console.log(
    `A ${req.method} request was made to ${req.path} at ${timestamp}`
  );

  next();
}

//global middleware setup
server.use(logger);
server.use(express.json());

server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
