const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session'); // added this library

const db = require('./database/dbConfig.js');

const server = express();

const sessionConfig = {
  secret: 'nobody-tosses.a%dwarf.!',
  name: 'monkey', // defaults to connect.sid
  httpOnly: true, // JS can't access this
  resave: false,
  saveUninitialized: false, // laws !
  cookie: {
    secure: false, // over httpS
    maxAge: 1000 * 60 * 1
  }
};
server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

// implemented this
server.post('/register', (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 10);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      req.session.username = user.username;
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post('/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ welcome: user.username });
      } else {
        res.status(401).json({ message: 'you shall not pass!' });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('You cannot leave!');
      } else {
        res.send('good bye');
      }
    });
  }
});

// protect this route, only authenticated users should see it
server.get('/users', protected, (req, res) => {
  console.log(req.session);
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
}

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
