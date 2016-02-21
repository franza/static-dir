var assert = require('assert');
var sinon = require('sinon');

describe('util', function () {
    var util = require('../../util');

    var res, input, badInput;

    beforeEach(function () {
        res = { writeHead: sinon.spy(), end: sinon.spy() };
        input = [
            {
                name: 'file1',
                stat: {
                    dev: 14194538,
                    mode: 133188,
                    nlink: 11,
                    uid: 11000,
                    gid: 11000,
                    rdev: 10,
                    blksize: 14096,
                    ino: 11162,
                    size: 11228,
                    blocks: 18,
                    atime: new Date(14532514620),
                    mtime: new Date(14532514621),
                    ctime: new Date(14532514622),
                    birthtime: new Date(14532514623),
                    isDirectory: sinon.stub().returns(false),
                    isFile: sinon.stub().returns(true),
                    isBlockDevice: sinon.stub().returns(false),
                    isCharacterDevice: sinon.stub().returns(false),
                    isSymbolicLink: sinon.stub().returns(false),
                    isFIFO: sinon.stub().returns(false),
                    isSocket: sinon.stub().returns(false)
                }
            },
            {
                name: 'dir1',
                stat: {
                    dev: 24194538,
                    mode: 233188,
                    nlink: 21,
                    uid: 21000,
                    gid: 21000,
                    rdev: 20,
                    blksize: 24096,
                    ino: 21162,
                    size: 21228,
                    blocks: 28,
                    atime: new Date(14532524620),
                    mtime: new Date(14532524621),
                    ctime: new Date(14532524622),
                    birthtime: new Date(14532524623),
                    isDirectory: sinon.stub().returns(true),
                    isFile: sinon.stub().returns(false),
                    isBlockDevice: sinon.stub().returns(false),
                    isCharacterDevice: sinon.stub().returns(false),
                    isSymbolicLink: sinon.stub().returns(false),
                    isFIFO: sinon.stub().returns(false),
                    isSocket: sinon.stub().returns(false)
                }
            },
            {
                name: 'symLink1',
                stat: {
                    dev: 34194538,
                    mode: 333188,
                    nlink: 31,
                    uid: 31000,
                    gid: 31000,
                    rdev: 30,
                    blksize: 34096,
                    ino: 31162,
                    size: 31228,
                    blocks: 38,
                    atime: new Date(14532534620),
                    mtime: new Date(14532534621),
                    ctime: new Date(14532534622),
                    birthtime: new Date(14532534623),
                    isDirectory: sinon.stub().returns(false),
                    isFile: sinon.stub().returns(false),
                    isBlockDevice: sinon.stub().returns(false),
                    isCharacterDevice: sinon.stub().returns(false),
                    isSymbolicLink: sinon.stub().returns(true),
                    isFIFO: sinon.stub().returns(false),
                    isSocket: sinon.stub().returns(false)
                }
            }
        ];
        badInput = [
            {
                name: 'fifo',
                stat: {
                    dev: 44194538,
                    mode: 433188,
                    nlink: 41,
                    uid: 41000,
                    gid: 41000,
                    rdev: 40,
                    blksize: 44096,
                    ino: 41162,
                    size: 41228,
                    blocks: 48,
                    atime: new Date(14532544620),
                    mtime: new Date(14532544621),
                    ctime: new Date(14532544622),
                    birthtime: new Date(14532544623),
                    isDirectory: sinon.stub().returns(false),
                    isFile: sinon.stub().returns(false),
                    isBlockDevice: sinon.stub().returns(false),
                    isCharacterDevice: sinon.stub().returns(false),
                    isSymbolicLink: sinon.stub().returns(false),
                    isFIFO: sinon.stub().returns(true),
                    isSocket: sinon.stub().returns(false)
                }
            }
        ];
    });

    describe('#withJson', function () {
        it('should respond with proper data', function () {
            util.withJson(input, res);
            assert.strictEqual(res.writeHead.calledOnce, true);
            assert.strictEqual(res.writeHead.firstCall.args[0], 200);
            assert.deepEqual(res.writeHead.firstCall.args[1], { "Content-Type": "application/json" });
            var expectation = [
                {
                    type: 'file',
                    name: input[0].name,
                    size: input[0].stat.size,
                    created: input[0].stat.birthtime,
                    modified: input[0].stat.mtime.getTime(),
                    lastAccessed: input[0].stat.atime.getTime(),
                },
                {
                    type: 'dir',
                    name: input[1].name,
                    size: input[1].stat.size,
                    created: input[1].stat.birthtime,
                    modified: input[1].stat.mtime.getTime(),
                    lastAccessed: input[1].stat.atime.getTime(),
                },
                {
                    type: 'sym-link',
                    name: input[2].name,
                    size: input[2].stat.size,
                    created: input[2].stat.birthtime,
                    modified: input[2].stat.mtime.getTime(),
                    lastAccessed: input[2].stat.atime.getTime(),
                }
            ];
            assert.strictEqual(res.end.calledOnce, true);
            assert.strictEqual(res.end.firstCall.args[0], JSON.stringify(expectation));
        });

        it('should respond with empty list', function () {
            util.withJson([], res);
            assert.strictEqual(res.writeHead.calledOnce, true);
            assert.strictEqual(res.writeHead.firstCall.args[0], 200);
            assert.deepEqual(res.writeHead.firstCall.args[1], { "Content-Type": "application/json" });
            assert.strictEqual(res.end.calledOnce, true);
            assert.strictEqual(res.end.firstCall.args[0], JSON.stringify([]));
        });

        it('should throw if null or undefined', function () {
            assert.throws(function () {
                util.withJson(null, res);
            });
            assert.throws(function () {
                util.withJson(undefined, res);
            });
            assert.throws(function () {
                util.withJson([], null);
            });
            assert.throws(function () {
                util.withJson([], undefined);
            });
        });

        it('should throw if unsupported file type', function () {
            assert.throws(function () {
                util.withJson(badInput, res);
            });
        });
    });

    describe('#withHtml', function () {
        it('should respond with proper data', function () {
            util.withHtml(input, res);
            assert.strictEqual(res.writeHead.calledOnce, true);
            assert.strictEqual(res.writeHead.firstCall.args[0], 200);
            assert.deepEqual(res.writeHead.firstCall.args[1], { 'Content-Type': 'text/html' });
            var expectation = '<html><body><ul><li>file1</li><li>dir1</li><li>symLink1</li></ul></body></html>';
            assert.strictEqual(res.end.calledOnce, true);
            assert.strictEqual(res.end.firstCall.args[0], expectation);
        });

        it('should respond with empty list', function () {
            util.withHtml([], res);
            assert.strictEqual(res.writeHead.calledOnce, true);
            assert.strictEqual(res.writeHead.firstCall.args[0], 200);
            assert.deepEqual(res.writeHead.firstCall.args[1], { 'Content-Type': 'text/html' });
            assert.strictEqual(res.end.calledOnce, true);
            var expectation = '<html><body><ul></ul></body></html>';
            assert.strictEqual(res.end.firstCall.args[0], expectation);
        });

        it('should throw if null or undefined', function () {
            assert.throws(function () {
                util.withHtml(null, res);
            });
            assert.throws(function () {
                util.withHtml(undefined, res);
            });
            assert.throws(function () {
                util.withHtml([], null);
            });
            assert.throws(function () {
                util.withHtml([], undefined);
            });
        });
    });
});

describe('middleware', function() {
    var createMiddleware = require('../../lib/middleware');

    var targetPath, mount, fs, url, parsedReqUrl, path, req, res, options, dirEntries,
        dirStat, fileStat1, fileStat2, fileStatPath1, fileStatPath2, mw, next;

    beforeEach(function () {
        targetPath = 'target-path';
        mount = 'mount-dir';
        dirEntries = ['1', '2'];
        dirStat = { tag: 'dir-stat', isDirectory: sinon.stub().returns(true) };
        fileStat1 = { tag: 'file-stat-1' };
        fileStat2 = { tag: 'file-stat-2' };
        fileStatPath1 = 'file-stat-path-1';
        fileStatPath2 = 'file-stat-path-2';
        req = { url: 'req-url' };
        res = { tag: 'res' };
        parsedReqUrl = { pathname: 'parsed-req-url' };
        url = { parse: sinon.stub().returns(parsedReqUrl) };
        path = { join: sinon.stub() };
        path.join
            .onCall(0).returns(targetPath)
            .onCall(1).returns(fileStatPath1)
            .onCall(2).returns(fileStatPath2);
        fs = { lstat: sinon.stub(), readdir: sinon.stub().yields(null, dirEntries) };
        fs.lstat
            .onCall(0).yields(null, dirStat)
            .onCall(1).yields(null, fileStat1)
            .onCall(2).yields(null, fileStat2);
        options = { fallthrough: true, respond: sinon.spy() };
        mw = createMiddleware(fs, url, path, mount, options);
        next = sinon.spy();
    });

    it('should respond with data', function (done) {
        mw(req, res, next, function (err) {
            assert.ifError(err);
            assert.strictEqual(options.respond.callCount, 1);
            assert.deepEqual(options.respond.firstCall.args, [
                [
                    { name: '1', stat: fileStat1 },
                    { name: '2', stat: fileStat2 }
                ],
                res
            ]);
            assert.strictEqual(fs.readdir.callCount, 1);
            assert.strictEqual(fs.readdir.firstCall.args[0], targetPath);
            assert.strictEqual(fs.lstat.callCount, 3);
            assert.strictEqual(fs.lstat.firstCall.args[0], targetPath);
            assert.strictEqual(fs.lstat.secondCall.args[0], fileStatPath1);
            assert.strictEqual(fs.lstat.thirdCall.args[0], fileStatPath2);
            assert.strictEqual(path.join.callCount, 3);
            assert.deepEqual(path.join.firstCall.args, [mount, parsedReqUrl.pathname]);
            assert.deepEqual(path.join.secondCall.args, [targetPath, '1']);
            assert.deepEqual(path.join.thirdCall.args, [targetPath, '2']);
            assert.strictEqual(url.parse.callCount, 1);
            assert.deepEqual(url.parse.firstCall.args, [req.url]);
            done();
        });
    });

    // TODO: cover error cases
});