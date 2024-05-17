// skeletal implementation for the routes which a general user can access
const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: 'User successfully registred. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
  myPromise.then((books) => {
    return res.send(JSON.stringify(books, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const ISBN = req.params.isbn;
      if (books[ISBN]) {
        resolve(books[ISBN]);
      } else {
        reject(new Error('Book not found'));
      }
    }, 1000);
  });
  myPromise
    .then((book) => {
      return res.send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const author = req.params.author;
      const book = Object.values(books).filter(
        (book) => book.author === author
      );
      if (book.length > 0) {
        resolve(book);
      } else {
        reject(new Error('Author not found'));
      }
    }, 1000);
  });
  myPromise
    .then((book) => {
      return res.send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const title = req.params.title;
      const book = Object.values(books).filter((book) => book.title === title);
      if (book.length > 0) {
        resolve(book);
      } else {
        reject(new Error('Title not found'));
      }
    }, 1000);
  });
  myPromise
    .then((book) => {
      return res.send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  return res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
