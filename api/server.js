// BUILD YOUR SERVER HERE

const express = require('express');
const User = require('./users/model.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.json({ message: "Server running!" });
});

server.get('/api/users', async (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "The users information could not be retrieved" });
    });
});

server.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then(user => {
      user ? res.status(200).json(user) : res.status(404).json({ message: "The user with the specified ID does not exist" });
    })
    .catch(err => {
      res.status(500).json({ message: "The user information could not be retrieved" });
    });
});

server.post('/api/users', async (req, res) => {
  const newUser = req.body;

  if (!newUser.name || !newUser.bio) {
    res.status(400).json({ message: "Please provide name and bio for the user" });
  } else {
    User.insert(newUser)
      .then(createdUser => res.status(201).json(createdUser))
      .catch(err => res.status(500).json({ message: "There was an error while saving the user to the database" }));
  }
});

server.put('/api/users/:id', async (req, res) => {
  const updatedInfo = req.body;
  const { id } = req.params;

  if (!updatedInfo.name || !updatedInfo.bio) {
    res.status(400).json({ message: "Please provide name and bio for the user" })
  } else {
    await User.update(id, updatedInfo)
      .then(updatedUser => {
        if (updatedUser) {
          res.status(200).json(updatedUser);
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist" })
        }
      })
      .catch(err => {
        res.status(500).json({ message: "The user information could not be modified" });
      });
  }
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  User.remove(id)
    .then(removedUser => {
      if (removedUser) {
        res.status(200).json(removedUser);
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "The user could not be removed" })
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
