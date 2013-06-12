'use strict';

var util      = require('util');
var Transform = require('stream').Transform;

if (!Transform) Transform = require('readable-stream').Transform;

function rfc3986Encode(str, spaceToPlus) {
  var encoded = encodeURIComponent(str)
    .replace(/!/g,   '%21')
    .replace(/'/g,   '%27')
    .replace(/\(/g,  '%28')
    .replace(/\)/g,  '%29')
    .replace(/\*/g,  '%2A');

  if (spaceToPlus) return encoded.replace(/%20/g, '+');
  else return encoded;
}

function URLEncodeStream(options) {
  if (!(this instanceof URLEncodeStream)) return new URLEncodeStream(options);

  Transform.call(this, options);

  if (options) this.spaceToPlus = options.spaceToPlus;
}
util.inherits(URLEncodeStream, Transform);

URLEncodeStream.prototype._transform = function (chunk, encoding, callback) {
  if (encoding === 'buffer') encoding = 'binary';

  try {
    this.push(rfc3986Encode(chunk.toString(encoding), this.spaceToPlus));

    return callback();
  }
  catch (e) {
    return callback(e);
  }
};

module.exports = URLEncodeStream;
