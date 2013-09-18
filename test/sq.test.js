var path = require('path')
  , fs = require('fs')
  , assert = require('assert')
  , sq = require('../')
  , dest = path.join(__dirname, 'tmp')
  , template = fs.readFileSync(__dirname + '/support/template.js', 'utf8');

describe('#generate', function() {
  it('creates a new subsequent file with the supplied template to the given destination', function(done) {
    sq.generate(dest, { template: template, name: 'simple_name' }, function(err, file) {
      assert(err === null);
      assert(fs.readFileSync(file, 'utf8') === template);
      done();
    });
  });
});

describe('#name', function(){});
describe('#each', function(){});
describe('#remove', function(){});
