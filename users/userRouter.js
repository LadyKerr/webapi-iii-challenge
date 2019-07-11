const express = require("express");

const Users = require("./userDb.js");
const Posts = require("../posts/postDB.js");

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
router.get("/:id", (req, res) => {
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

//show posts made by specific user ID
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
router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was an error creating the new user." });
    });
});

//create a new post by user ID
router.post("/:id/posts", validatePost, (req, res) => {
  let newPost = req.body;
  const { id } = req.params;
  newPost.user_id = id;

  Posts.insert(newPost)
    .then(newPost => {
      res.status(201).json(newPost);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: "There was an error adding the user's post." });
    });
});

//delete user
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Users.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json(deleted);
      } else {
        res.status(404).json({ message: "That user ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was an error removing that user." });
    });
});

//update user info
router.put("/:id", validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  Users.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json(updated);
      } else {
        res
          .status(404)
          .json({ message: "The user with that id doesnt exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was an error updating the user." });
    });
});

//custom middlewares

function validateUserId(req, res, next) {
  const { id } = req.params;

  Users.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "Invalid user ID." });
    }
  });
  next();
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing user data." });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing required name field." });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing post data." });
  } else if (!req.body.text) {
    res.status(400).json({ message: "Missing required text field." });
  } else {
    next();
  }
}

module.exports = router;
