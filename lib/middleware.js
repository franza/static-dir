'use strict';

var async = require('async');
var cps = require('continuate');
var util = require('util');

function NotADirError(path, message) {
    if (!(this instanceof NotADirError)) {
        return new NotADirError(path, message);
    }
    message = message || path + ' is not a directory';
    Error.call(this, message);
    this.message = message;
}

util.inherits(NotADirError, Error);

NotADirError.prototype.name = 'NotADirError';

function createMiddleware(fs, url, path, mount, options) {

    function getFullPath(mount, reqUrl) {
        var pathname = url.parse(reqUrl).pathname;
        return path.join(mount, pathname);
    }

    function getMappedStat(targetPath, name, callback) {
        let entryPath = path.join(targetPath, name);
        fs.lstat(entryPath, function (err, stat) {
            if (err) {
                return callback(err);
            }
            callback(null, { name: name, stat: stat});
        });
    }

    return function (req, res, next) {
        var targetPath = getFullPath(mount, req.url);

        async.waterfall([
            function (callback) {
                fs.lstat(targetPath, callback);
            },
            function (stat, callback) {
                if (!stat.isDirectory()) { return callback(new NotADirError(path)); }
                callback();
            },
            function (callback) {
                fs.readdir(targetPath, callback);
            },
            function (contents, callback) {
                async.map(contents, function (name, callback) { getMappedStat(targetPath, name, callback); }, callback);
            }
        ], function (err, data) {
            if (err && !options.fallthrough) {
                console.log('passing an error');
                return next(err);
            }
            if (err) {
                return next();
            }
            options.respond(data, res);
        });
    };
}

module.exports = createMiddleware;