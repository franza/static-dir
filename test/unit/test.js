var assert = require('assert');

describe('util', function () {
    var util = require('../../util');
    var sinon = require('sinon');

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