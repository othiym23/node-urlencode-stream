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

test("should handle being passed buffers", function (t) {
  t.plan(2);

  var urler = new URLEncodeStream();
  urler.pipe(concat(function (data) {
    t.equal(data.toString('ascii'), "%5B1%2C%202%2C%203%2C%204%2C%205%5D",
            "should encode buffer correctly");
  }));

  t.doesNotThrow(function () {
    urler.write(new Buffer('[1, 2, 3, 4, 5]'));
  }, "shouldn't barf on a buffer");
  urler.end();
});

test("should error when given a malformed chunk", function (t) {
  t.plan(1);

  var urler = new URLEncodeStream();
  urler.on('error', function (error) {
    t.ok(error, "Error should be found.");
  });

  urler.pipe(concat(function () {
    t.fail("should never reach here");
  }));

  urler.write(String.fromCharCode(0xDFFF) + String.fromCharCode(0xE000));
});

test("should replace spaces with pluses when asked", function (t) {
  t.plan(2);

  var urler = new URLEncodeStream({spaceToPlus : true});
  urler.pipe(concat(function (data) {
    t.equal(data.toString('ascii'), "%5B1%2C+2%2C+3%2C+4%2C+5%5D",
            "should encode buffer correctly");
  }));

  t.doesNotThrow(function () {
    urler.write(new Buffer('[1, 2, 3, 4, 5]'));
  }, "shouldn't barf on a buffer");
  urler.end();
});
