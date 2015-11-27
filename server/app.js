// NodeBuildin Objects
    var path          = require('path');

// Node_modules Objects
    var express       = require('express');
    var morgan        = require('morgan');
    var bodyParser    = require('body-parser');
    var cookieParser  = require('cookie-parser');
    var favicon       = require('serve-favicon');
    var mongoose      = require('mongoose');
    var autoIncrement = require('mongoose-auto-increment');
    var session       = require('express-session');

// Own Objects
    var config       = require('./config/environment');
    var items        = require('./api/items');
    var comments = require('./api/comments');
    var area         = require('./api/area');
    var users        = require('./api/users');

// create WebServer
var app = express();

// connect MongoDB
var connect = mongoose.connect(config.mongo.uri);

autoIncrement.initialize(connect);

// create DBModule
var db = connect.connection;
db.on('error', console.error.bind(console, 'DB Connection Error!!'));

db.once('open', function(callback) {
    console.log('MongoDB Connectioned!!');
});

// MiddleWare
    app.use(express.static('client'));
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());

// Routes
    app.use('/api/items', items);
    app.use('/api/area', area);
    app.use('/api/users', users);
    app.use('/api/comments', comments);

// Listen server
    app.listen(config.port);
    console.log('coco server listen... with port: 5555');

// make Object
    module.exports = app;
