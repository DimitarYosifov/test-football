import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'

const bodyParser = require('body-parser');  //????????



const cors = require('cors');
const router = express.Router();
var request = require('request');

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
app.use(cors());                                         //??
// app.disable('x-powered-by');                             //??



app.use(bodyParser.urlencoded({ extended: false }));     //??
// app.use(bodyParser.text()); //???????? WTF
var jsonParser = bodyParser.json()
app.use(bodyParser.json());
app.use(router);



const PORT = process.env.PORT || 8080


app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})



// app.post('/getClubsPlayers', jsonParser, (req, res) => {    //test
app.post('/getClubsPlayers', (req, res) => {
  res.set('content-type', 'application/json');
  res.type('application/json');   // => 'application/json'   //???????
  let name = req.body.name;
  firebase.database().ref("/clubs/").orderByChild("name").equalTo(name).once('value').then(function(snapshot) {
    // firebase.database().ref("/clubs/").orderByChild("name").equalTo("testClub1").once('value').then(function (snapshot) {  //test!!
    res.status(200);
    res.json({
      clubData: Object.values(snapshot.val())[0]
    });
  });
});

// router.get('/getClubsPlayers', function(req, res){ 

//   request('http://www.google.com', function (error, response, body) {
//         console.log('error:', error); // Print the error if one occurred and handle it
//         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//         res.send(body)
//   });

// })