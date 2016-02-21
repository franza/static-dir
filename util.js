'use strict';

function getType(stat) {
  if (stat.isFile()) {
    return 'file';
  } else if (stat.isDirectory()) {
    return 'dir';
  } else if (stat.isSymbolicLink()) {
    return 'sym-link';
  } else {
    throw Error('Unsupported file type');
  }
}

function asJson(entries) {
    return entries.map(function (entry) {
        var type = getType(entry.stat);
        var name = entry.name;
        var stat = entry.stat;
        return {
            type: type,
            name: name,
            size: stat.size,
            created: stat.birthtime,
            modified: stat.mtime.getTime(),
            lastAccessed: stat.atime.getTime(),
        };
    });
}

exports.withJson = function (entries, res) {
    entries = asJson(entries);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(entries));
};

exports.withHtml = function (entries, res) {
    var html =
        '<html>' +
            '<body>' +
                '<ul>' +
                    entries.map(function (entry) { return '<li>' + entry.name + '</li>'; }).join('') +
                '</ul>' +
            '</body>' +
        '</html>';
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
};