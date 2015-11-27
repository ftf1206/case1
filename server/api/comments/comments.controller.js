/**
 * GET     /api/comments              ->  index
 * POST    /api/comments              ->  create
 * GET     /api/comments/:id          ->  show
 * PUT     /api/comments/:id          ->  update
 * DELETE  /api/comments/:id          ->  delete
 */

// Dependences Modules
var Comments = require('./comments.model');
var _ = require('lodash');

//index
exports.index = function(req, res) {

    if (req.body.name) {
        req.body.name = new RegExp('^' + req.body.name);
    }

    Comments.find(req.body, function(err, data) {
        res.json(data);
    });
};

//create
exports.create = function(req, res) {


    var newItem = new Comments(req.body);


    newItem.save(function(err) {
        if(err) {
            console.log(err);
            var errData = {
                type    : err.type,
                message : err.message
            };

            res.json(errData);

        } else {
            console.log(newItem);
            res.json(newItem);

        }
    });
};

exports.update = function(req, res) {
    Comments.findOne({_id: req.params._id}, function(err, data) {

        _.extend(data, req.body);
        data.modified = new Date();

        data.save(function(err, data) {
            if(err) {
            console.log(err.message);
            }
            res.json(data);
        });

    });
};

// delete
exports.delete = function(req, res) {
    Comments.remove({_id: req.params._id}, function(err) {
        if(err) {
            console.log('error');
        }
        Comments.find({}, function(err, data) {
            res.json(data);
        });
    });
};