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

  var suffix = opts.suffix || ''
    , template = opts.template || ''
    , sep = opts.sep || ''
    , file = path.join(dest, this.name(suffix, sep));

  fs.writeFile(file, template, function(err) {
    if (err) return fn(err);
    fn(null, file);
  });
};

exports.name = function(suffix, sep) {
  suffix = suffix || '';
  sep = sep || '';

  var date = new Date
    , parts = null
    , prefix = null;

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

  return prefix + sep + suffix;
};

/**
 * @returns {String}
 * @api private
 */

function pad(str, len) {
  str += '';
  return str.length >= len ? str : new Array(len - str.length + 1).join('0') + str;
}
