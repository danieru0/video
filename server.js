const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(flash());

require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const dropboxToken = require('./config/dropbox');
const dbx = new Dropbox({ accessToken: dropboxToken.accessToken });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './videos');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
})

const upload = multer({ storage });

app.post('/api/get-video', (req, res) => {
  dbx.filesGetTemporaryLink({path: '/videos/'+req.body.id})
    .then((resp) => {
      res.json(resp.link);
    }).catch((err) => {
      res.json('null');
    });
});

app.post('/api/add-video', upload.single('video'), (req, res) => {
  fs.readFile('./videos/'+req.file.filename, (err, file) => {
    if (err) {
      throw err;
    }
    dbx.filesUpload({path: '/videos/'+req.file.filename, contents: file}).then(() => {
      res.json(req.file.filename);
    }).catch((error) => {
      res.json(error);
    });
  });
  fs.unlink('./videos/'+req.file.filename, (err) => {
    //console.log('temp video removed');
  });
});

app.post('/api/remove-video', (req, res) => {
  dbx.filesDeleteV2({path: '/videos/'+req.body.id}).then(() => {
    res.json('success');
  }).catch(error => {
    res.json(error);
    console.log(error);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/public/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => `Server running on port ${port}`);