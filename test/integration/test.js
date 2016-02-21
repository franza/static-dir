var assert = require('assert');
var express = require('express');
var directory = require('../../index');
var util = require('../../util');
var http = require('http');

describe('middleware', function () {
    function GET(path, callback) {
        var req = http.get('http://localhost:' + process.env.PORT + path, function (res) {
            var data = '';
            res.on('data', function (chunk) { data += chunk; });
            res.on('end', function () { callback(null, data); });
            res.on('error', callback);
        });
        req.on('error', callback);
    }

    var app, server;

    beforeEach(function (done) {
        app = express();
        server = app.listen(process.env.PORT, process.env.HOST, done);
    });

    afterEach(function (done) {
        server.close(done);
    });

    it('should provide an list of directory contents in JSON', function (done) {
        app.use(directory(__dirname + '/dir1'));
        GET('/', function (err, data) {
            assert.ifError(err);
            assert.strictEqual(typeof data, 'string');
            data = JSON.parse(data);
            assert.strictEqual(data instanceof Array, true);
            assert.strictEqual(data.length, 2);
            assert.strictEqual(data[0].name, 'dir2');
            assert.strictEqual(data[1].name, 'file1');
            done();
        });
    });

    it('should provide an list of directory contents in JSON if set explicitly', function (done) {
        app.use(directory(__dirname + '/dir1', { respond: util.withJson }));
        GET('/', function (err, data) {
            assert.ifError(err);
            assert.strictEqual(typeof data, 'string');
            data = JSON.parse(data);
            assert.strictEqual(data instanceof Array, true);
            assert.strictEqual(data.length, 2);
            assert.strictEqual(data[0].name, 'dir2');
            assert.strictEqual(data[1].name, 'file1');
            done();
        });
    });

    it('should provide an list of directory contents in HTML', function (done) {
        app.use(directory(__dirname + '/dir1', { respond: util.withHtml }));
        GET('/', function (err, data) {
            assert.ifError(err);
            assert.notStrictEqual(data, '');
            assert.strictEqual(typeof data, 'string');
            assert.notStrictEqual(data.toLowerCase().indexOf('html'), -1);
            done();
        });
    });

    it('should trigger error middleware if fallthrough set to false', function (done) {
        app.use(directory(__dirname + '/dir1', { fallthrough: false }));
        app.use(function (req, res, next) {
            res.status(200).send('ok');
        });
        app.use(function (_, req, res, next) {
            res.status(500).send('Something broke!');
        });
        GET('/somenonexistentfile', function (err, data) {
            assert.ifError(err);
            assert.strictEqual(data, 'Something broke!');
            done();
        });
    });

    it('should not trigger error middleware if fallthrough set to true', function (done) {
        app.use(directory(__dirname + '/dir1', { fallthrough: true }));
        app.use(function (req, res, next) {
            res.status(200).send('ok');
        });
        app.use(function (_, req, res, next) {
            res.status(500).send('Something broke!');
        });
        GET('/somenonexistentfile', function (err, data) {
            assert.ifError(err);
            assert.strictEqual(data, 'ok');
            done();
        });
    });

    it('should not trigger error middleware if fallthrough is not set', function (done) {
        app.use(directory(__dirname + '/dir1'));
        app.use(function (req, res, next) {
            res.status(200).send('ok');
        });
        app.use(function (_, req, res, next) {
            res.status(500).send('Something broke!');
        });
        GET('/somenonexistentfile', function (err, data) {
            assert.ifError(err);
            assert.strictEqual(data, 'ok');
            done();
        });
    });

    it('should provide an list of subdirectory contents in JSON', function (done) {
        app.use(directory(__dirname + '/dir1'));
        GET('/dir2', function (err, data) {
            assert.ifError(err);
            assert.strictEqual(typeof data, 'string');
            data = JSON.parse(data);
            assert.strictEqual(data instanceof Array, true);
            assert.strictEqual(data.length, 1);
            assert.strictEqual(data[0].name, 'file2');
            done();
        });
    });
});