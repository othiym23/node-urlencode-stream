'use strict';

var test            = require('tap').test;
var concat          = require('concat-stream');
var URLEncodeStream = require('../index.js');

test("should urlencode a stream", function (t) {
  t.plan(1);

  var urler = new URLEncodeStream();
  urler.pipe(concat(function (data) {
    t.equal(data.toString('ascii'), "%5B1%2C%202%2C%203%2C%204%2C%205%5D",
            "should escape entire stream");
  }));

  urler.write('[1, 2');
  urler.write(', 3, 4, ');
  urler.write('5]');
  urler.end();
});
