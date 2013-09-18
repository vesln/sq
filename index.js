/**
 * Core dependencies.
 */

var fs = require('fs')
  , path = require('path');

/**
 * Generate a new file.
 *
 * @param {String} destination
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

exports.generate = function(dest, opts, fn) {
  var name = opts.name || '';
  var template = opts.template || '';
  var file = getPath(dest, name);

  fs.writeFile(file, template, function(err) {
    if (err) return fn(err);
    fn(null, file);
  });
};

function getPath(dest, name) {
  return path.join(dest, seq() + name);
}

/**
 * Zero-pad a string with the length of 1.
 *
 * @param {String} str
 * @returns {String}
 * @api private
 */

function pad(str) {
  str += '';
  if (str.length === 1) str = '0' + str;
  return str;
}

/**
 * YYYYMMDDHHMMSS
 *
 * @returns {String}
 * @api private
 */

function seq() {
  var date = new Date;

  var parts = [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  ];

  return parts.map(function(part) {
    return pad(part);
  }).join('');
}
