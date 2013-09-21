/**
 * Core dependencies.
 */

var fs = require('fs');
var path = require('path');

/**
 * Generate a new file.
 *
 * @param {String} destination
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

exports.generate = function(dest, opts, fn) {
  if (arguments.length === 2) {
    fn = opts;
    opts = {};
  }

  var template = opts.template || '';
  var file = path.join(dest, this.name(opts.suffix, opts.sep, opts.ext));

  fs.writeFile(file, template, function(err) {
    if (err) return fn(err);
    fn(null, file);
  });
};

/**
 * @param {String} suffix
 * @param {String} separator
 * @param {String} extension
 * @returns {String}
 * @api public
 */

exports.name = function(suffix, sep, ext) {
  var date = new Date;
  var parts = null;
  var prefix = null;

  suffix = suffix || '';
  sep = sep || '';
  ext = ext || '';

  parts = [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  ];

  prefix = parts.map(function(part, i) {
    var len = i === parts.length - 1 ? 3 : 2;
    return pad(part, len);
  }).join('');

  return prefix + sep + suffix + ext;
};

exports.each = function(dest, fn) {
  this.files(dest, function(err, files) {
    if (err) return fn(err);

    files.forEach(function(file, i) {
      fn(null, path.join(dest, file), i);
    });
  });
};

exports.removeLast = function(dest, fn) {
  var self = this;

  this.files(dest, function(err, files) {
    if (err) return fn(err);
    fs.unlink(path.join(dest, files.reverse()[0]), fn);
  });
};

exports.files = function(dest, fn) {
  fs.readdir(dest, function(err, files) {
    if (err) return fn(err);

    files = files.sort().filter(function(file) {
      return !file.match(/^\./);
    });

    fn(null, files);
  });
};

/**
 * @returns {String}
 * @api private
 */

function pad(str, len) {
  str += '';
  return str.length >= len ? str : new Array(len - str.length + 1).join('0') + str;
}
