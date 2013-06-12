You need to urlencode a stream you're sending to a web server somewhere. You
want this:

```javascript
var fs = require('fs');
var request = require('request');
var URLEncodeStream = require('urlencode-stream');
var handler = require('./response-handler');


fs.createReadStream('./sample-data.txt')
  .pipe(new URLEncodeStream())
  .pipe(request('http://example.com/postme', handler));
```

Depends on streams2, one way or another.
