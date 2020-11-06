import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'

const cors = require('cors');
const router = express.Router();

const bcrypt = require('bcryptjs');
const firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');

const config_firebase = {
  apiKey: 'AIzaSyB6CoLU9BDQyk998IlqyIY7cVwSR-fvsSw',
  authDomain: 'football-d4256.firebaseapp.com',
  databaseURL: 'football-d4256.firebaseio.com',
  storageBucket: 'football-d4256.appspot.com'
};

firebase.initializeApp(config_firebase);

const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, 'index.html'),
  compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.get('*', (req, res, next) => {

  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})
// app.use(cors());                                         //??
// app.disable('x-powered-by');                             //??
// app.use(bodyParser.urlencoded({ extended: false }));     //??
// app.use(bodyParser.json());                              //??

const PORT = process.env.PORT || 8080


app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})
app.post('/getClubsPlayers', async (req, res) => {
  res.set('content-type', 'application/json')

  let name = req.body.name;
  firebase.database().ref("/clubs/").orderByChild("name").equalTo(name).once('value').then(function (snapshot) {
    res.status(200);
    res.json({
      clubData: Object.values(snapshot.val())[0]
    });
  });
});

