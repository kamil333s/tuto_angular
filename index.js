'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let models = require('./models');
let auth = require('./lib/authenticate');
let publicRouter = express.Router();
let adminRouter = express.Router();
let sessionsRouter = express.Router();
let subjectsRouter = express.Router();
let tablesRouter = express.Router();


var io = require('socket.io').listen(app.listen(3000, () => {
  console.log('Sockets listening on 3000');
}));

io.sockets.on('connection', function (socket) {
    console.log('client connect');
    socket.on('echo', function (data) {
      console.log('recieved echo!!');
      io.sockets.emit('newSession', data);
    });
    socket.on('newMessage', function (data) {
      // console.log('bark!');
      io.sockets.emit('bark', data);
    });
});

require('./routes/login')(publicRouter, models);
require('./routes/admin-routes')(adminRouter, models);
require('./routes/sessions-routes')(sessionsRouter, models);
require('./routes/subjects-routes')(subjectsRouter, models);
require('./routes/tables-routes')(tablesRouter, models);


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
// The extended config object key now needs
// to be explicitly passed, since it now has no default value.
app.use(function(req,res,next){
    req.io = io;
    next();
});
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(publicRouter);
app.use(sessionsRouter);
app.use(auth);
app.use('/admin', adminRouter, subjectsRouter,  tablesRouter);
