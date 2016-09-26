'use strict';

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

module.exports = function(grunt) {

  function md5(filepath, algorithm, encoding) {
    var hash = crypto.createHash(algorithm);
    grunt.log.verbose.write('Hashing ' + filepath + '...');
    // treat all files as byte sequences, encoding is null.
    hash.update(fs.readFileSync(filepath));
    return hash.digest(encoding);
  }

  grunt.registerMultiTask('rev', 'Prefix static asset file names with a content hash', function() {

    var options = this.options({
      algorithm: 'md5',
      length: 8
    });

    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(f) {

        var hash = md5(f, options.algorithm, 'hex'),
          prefix = hash.slice(0, options.length),
          renamed = [prefix, path.basename(f)].join('.'),
          outPath = path.resolve(path.dirname(f), renamed);

        grunt.verbose.ok().ok(hash);
        fs.renameSync(f, outPath);
        grunt.log.write(f + ' ').ok(renamed);

      });
    });

  });

};
