const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const firebase = require('firebase');
const config = require('./config/firebase');

const { check, validationResult } = require('express-validator/check');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(flash());

//firebase config
firebase.initializeApp(config);

//dropbox config
require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const dbx = new Dropbox({ accessToken: 'CV09yugEd2AAAAAAAAAADmcjkJ-SeJlYCq7aFx0UlxVuGbUoZWeLcP0adKRikugV' });

//api for getting user informations
app.get('/api/user', (req, res) => {
  const user = firebase.auth().currentUser;
  res.json(user);
});

//api for getting videos miniatures
app.get('/api/miniatures', (req, res) => {
    /*dbx.filesGetTemporaryLink({path: '/Sun.png'})
      .then((resp) => {
        res.json(resp.link);
    });*/
});

app.post('/login', (req, res) => {
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(() => {
    res.json('success');
  }).catch((error) => {
    res.json('error');
  });
});

app.post('/register', (req, res) => {
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(() => {
    res.json('success');
  }).catch((error) => {
    res.json('error');
  });
});

app.get('/logout', (req, res) => {
  firebase.auth().signOut().then(() => {
    res.json('success');
  }).catch((error) => {
    res.json('error');
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/public/index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port}`);