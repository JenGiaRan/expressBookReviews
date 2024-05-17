//skeletal implementation for the routes which an authorized user can access
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let existingUser = users.filter((user) => {
    return user.username === username;
  });
  return existingUser.length > 0 ? false : true;
};

const authenticatedUser = (username, password) => {
  //Code to check if username and password match the one we have in records.
  let validUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validUser.length > 0 ? true : false;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: '1h' }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  let book = books[ISBN];

  if (book) {
    let reviews = req.body.reviews;
    let username = req.session.authorization.username;

    if (reviews) {
      book['reviews'][username] = reviews;
    }
    res.send('The review' + ' ' + req.body.reviews + ' Has been added!');
  } else {
    res.send('Unable to add the review!');
  }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  let book = books[ISBN];
  let username = req.session.authorization.username;

  if (book) {
    delete book['reviews'][username];
    res.send('The review has been deleted!');
  } else {
    res.send('Unable to delete the review!');
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
