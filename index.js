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
  if (arguments.length === 2) {
    fn = opts;
    opts = {};
  }

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
 * @returns {String}
 * @api private
 */

function pad(str, len) {
  str += '';
  return str.length >= len ? str : new Array(len - str.length + 1).join('0') + str;
}

/**
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
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  ];

  return parts.map(function(part, i) {
    var len = i === parts.length - 1 ? 3 : 2;
    return pad(part, len);
  }).join('');
}
