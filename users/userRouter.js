const express = require("express");

const Users = require("./userDb.js");

const router = express.Router();

//display users
router.get("/", (req, res) => {
  Users.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Could not retrieve user information." });
    });
});

//display users by their ID
router.get("/:id", validateUserId, (req, res) => {
  const { id } = req.params;

  Users.getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(400)
          .json({ message: "The user with that ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

//show post by specified ID
router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;

  Users.getUserPosts(id)
    .then(userPost => {
      if (userPost) {
        res.status(200).json(userPost);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

//create a new user
router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "Invalid user ID." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "error retrieving that user." });
    });
}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
