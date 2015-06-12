var Item = require('../models/item');

exports.save = function(name, callback, errback) {
    Item.create({ name: name }, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.list = function(callback, errback) {
    Item.find(function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

exports.edit = function(id, newName, callback, errback) { 
    Item.findOneAndUpdate({_id: id},{name: newName},  {new:true}, function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

exports.delete = function(id, callback, errback) {
    Item.findOneAndRemove({_id: id}, function(err, items) {
        if (err || items === null) {
            errback(err);
            return;
        }
        callback(items);
    });
};