'use strict';

function getType(stat) {
  if (stat.isFile()) {
    return 'File';
  } else if (stat.isDirectory()) {
    return 'Dir';
  } else if (stat.isSymbolicLink()) {
    return 'SymLink';
  } else {
    throw Error('Unsupported file type');
  }
}

exports.asJson = function (entries) {
    var type = getType(entries.stat);
    return {
        type: type,
        name: entries.name,
        size: entries.stat.size,
        creation_time: entries.stat.birthtime,
        last_modification_time: entries.stat.mtime.getTime(),
        last_access_time: entries.stat.atime.getTime(),
    };
};

exports.withJson = function (data, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(data));
};