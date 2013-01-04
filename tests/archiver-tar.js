var crypto = require('crypto');
var fs = require('fs');

var mkdir = require('mkdirp');
var rimraf = require('rimraf');

var archiver = require('../lib/archiver');

var fileOutput = true;

var date1 = new Date('Jan 03 2013 14:26:38 GMT');

module.exports = {
  tarBuffer: function(test) {
    test.expect(1);

    var actual;
    var expected = 'f2d375454bd5630a062a2b787a48458a83fcb6ac';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createTar({
      forceUTC: true
    });

    if (fileOutput) {
      rimraf.sync('tmp/buffer.tar');
      var out = fs.createWriteStream('tmp/buffer.tar');
      archive.pipe(out);
    }

    var buffer = new Buffer(20000);

    for (var i = 0; i < 20000; i++) {
      buffer.writeUInt8(i&255, i);
    }

    archive.addFile(buffer, {name: 'buffer.txt', date: date1}, function() {
      archive.finalize();
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.on('data', function(data) {
      hash.update(data);
    });

    archive.on('end', function() {
      actual = hash.digest('hex');
      test.equals(actual, expected, 'data hex values should match.');
      test.done();
    });
  },

  tarString: function(test) {
    var actual;
    var expected = '8c99caf67e153c62f2d69a40ff339b9b07775935';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createTar({
      forceUTC: true
    });

    if (fileOutput) {
      rimraf.sync('tmp/string.tar');
      var out = fs.createWriteStream('tmp/string.tar');
      archive.pipe(out);
    }

    archive.addFile('string', {name: 'string.txt', date: date1}, function() {
      archive.finalize();
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.on('data', function(data) {
      hash.update(data);
    });

    archive.on('end', function() {
      actual = hash.digest('hex');
      test.equals(actual, expected, 'data hex values should match.');
      test.done();
    });
  }
};