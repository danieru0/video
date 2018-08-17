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

//dropbox config
require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const dbx = new Dropbox({ accessToken: 'CV09yugEd2AAAAAAAAAADmcjkJ-SeJlYCq7aFx0UlxVuGbUoZWeLcP0adKRikugV' });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './videos');
  },
  filename: (req, file, cb) => {
    //cb(null, `${file.originalname}`);
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
})

const upload = multer({ storage });

//api for getting videos miniatures
app.get('/api/miniatures', (req, res) => {
    /*dbx.filesGetTemporaryLink({path: '/Sun.png'})
      .then((resp) => {
        res.json(resp.link);
    });*/
});

app.get('/api/all-videos', (req, res) => {
  let data = [];
  res.send(fs.readdirSync('./videos'));
});

app.post('/api/add-video', upload.single('video'), (req, res) => {
  fs.readFile('./videos/'+req.file.filename, (err, file) => {
    if (err) {
      throw err;
    }
    dbx.filesUpload({path: '/videos/'+req.file.filename, contents: file}).then(() => {
      res.json('ok');
    }).catch((error) => {
      res.json(error);
    });
  });
  /*fs.unlink('./videos/'+req.file.filename, (err) => {
    console.log('temp video removed');
  });*/
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/public/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => `Server running on port ${port}`);