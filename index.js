'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');

var createMiddleware = require('./lib/middleware');
var util = require('./util');

module.exports = function (mount, options) {
    options = options || {};
    options.respond = options.respond || util.withJson;
    options.fallthrough = options.fallthrough !== false;
    return createMiddleware(fs, url, path, mount, options);
};