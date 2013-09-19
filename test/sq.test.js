var path = require('path')
  , fs = require('fs')
  , assert = require('assert')
  , rimraf = require('rimraf')
  , sq = require('../')
  , dest = path.join(__dirname, 'tmp', path.sep)
  , template = fs.readFileSync(__dirname + '/support/template.js', 'utf8');

describe('#generate', function() {
  beforeEach(recreateTemp);

  it('creates a new file with the supplied template to the given destination', function(done) {
    sq.generate(dest, { template: template }, function(err, file) {
      assert(err === null);
      assert(file.indexOf(dest) === 0);
      assert(fs.readFileSync(file, 'utf8') === template);
      done();
    });
  });

  it('builds a unique sequential filename', function(done) {
    sq.generate(dest, function(err, file) {
      assert(err === null);

      setTimeout(function() {
        sq.generate(dest, function(err, file2) {
          assert(err === null);
          assert(+file.replace(dest, '') < +file2.replace(dest, ''));
          done();
        });
      }, 10);
    });
  });

  it('supports a custom suffix, custom separator and a custom extension', function(done) {
    sq.generate(dest, { suffix: 'simple_name', sep: '_', ext: '.js' }, function(err, file) {
      assert(err === null);
      assert(file.replace(dest, '').replace(/[0-9]/g, '') === '_simple_name.js')
      done();
    });
  });
});

describe('#each', function(){});
describe('#remove', function(){});

function recreateTemp(done) {
  rimraf(dest, function(err) {
    if (err) throw err;
    fs.mkdirSync(dest);
    done();
  });
}
