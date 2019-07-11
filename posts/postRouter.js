const express = require("express");

const Posts = require("../posts/postDB.js");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.get()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({ message: "Could not retrieve post information." });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  const { id } = req.params;

  Posts.getById(id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then(deleted => {
      res.status(204).json(deleted);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was an error removing that post." });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  Posts.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json(updated);
      } else {
        res
          .status(404)
          .json({ message: "The post with that id doesnt exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was an error updating the post." });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;

  Posts.getById(id).then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({ message: "Invalid post ID." });
    }
  });
  next();
}

module.exports = router;
