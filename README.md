# static-dir
Serve directory listings for NodeJS express apps

Usage with [serve-static](https://github.com/expressjs/serve-static):

```javascript
var express = require('express');
app = express();
server = app.listen(process.env.PORT, process.env.HOST);

var directory = require('static-dir');
var files = require('serve-static');

app.use(directory(__dirname + '/dir1'));
app.use(files(__dirname + '/dir1'));
```

In most cases you probably want to use [serve-index](https://github.com/expressjs/serve-index), however `static-dir` is more customizable:

```javascript
var directory = require('static-dir');
var withHtml = require('static-dir/util').withHtml;

// Respond with
app.use(directory(__dirname + '/dir1', { respond: withHtml }));
```

Or build your own `respond` function:

```javascript
// `entries` is array of { name: string, stat: fs.Stats } and represents contents of directory
// `res` is express HTTP response
function bananize(entries, res) {
    res.send('🍌🍌🍌🍌🍌🍌🍌🍌');
}

app.use(directory(__dirname, { respond: bananize }));
```
