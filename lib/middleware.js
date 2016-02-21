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
        var targetPath = getFullPath(mount, req.url);

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
                return next(err);
            }
            if (err) {
                return next();
            }
            try {
                options.respond(data, res);
            } catch (err) {
                next(err);
            }
        });
    };
}

module.exports = createMiddleware;