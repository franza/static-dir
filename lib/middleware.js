'use strict';

var async = require('async');

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
        try {
            var targetPath = getFullPath(mount, req.url);
        } catch (err) {
            callback(err);
            if (options.fallthrough) {
                next();
            } else {
                next(err);
            }
        }
        // callback for testing purposes only, must not be included in param list
        var callback = arguments[3] || function () { };

        async.waterfall([
            function (callback) {
                fs.lstat(targetPath, callback);
            },
            function (stat, callback) {
                if (!stat.isDirectory()) { return callback(new Error(path + ' is not a dir')); }
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
                callback(err);
                return next(err);
            }
            if (err) {
                callback(err);
                return next();
            }
            try {
                options.respond(data, res);
                callback();
            } catch (err) {
                callback();
                next(err);
            }
        });
    };
}

module.exports = createMiddleware;