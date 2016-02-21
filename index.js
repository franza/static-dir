'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');

var createMiddleware = require('./lib/middleware');
var util = require('./util');

module.export = function (mount, options) {
    options.mapper = util.asJson;
    options.respond = util.withJson;
    return createMiddleware(fs, url, path, mount, options);
};