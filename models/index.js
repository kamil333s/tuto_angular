'use strict';
let mongoose = require('mongoose');

var uri='mongodb://projectUser:password@ds025459.mlab.com:25459/cf401-project'

// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/db');
mongoose.connect(uri || 'mongodb://localhost/db');
let models = {};

require('./session')(mongoose, models);
require('./subject')(mongoose, models);
require('./user')(mongoose, models);
require('./table')(mongoose, models);
require('./archive')(mongoose, models);

module.exports = models;
