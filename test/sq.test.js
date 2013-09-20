/**
 * Core dependencies.
 */

var path = require('path')
  , fs = require('fs')
  , assert = require('assert');

/**
 * External dependencies.
 */

var rimraf = require('rimraf');

/**
 * Test setup.
 */

var sq = require('../')
  , dest = path.join(__dirname, 'tmp', path.sep)
  , template = fs.readFileSync(__dirname + '/support/template.js', 'utf8');

describe('sq', function() {
  beforeEach(recreateTemp);

  describe('#generate', function() {
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
        assert(file.replace(dest, '').replace(/[0-9]/g, '') === '_simple_name.js');
        done();
      });
    });
  });

  describe('#each', function(){
    it('iterates over all files in the supplied destination in ascending order', function(done) {
      sq.generate(dest, { suffix: 'first' }, function(err, file) {
        sq.generate(dest, { suffix: 'second' }, function(err, file) {
          sq.generate(dest, { suffix: 'third' }, function(err, file) {
            sq.each(dest, function(err, file, i) {
              assert(err === null);

              switch(i) {
                case 0: assert(strip(file) === 'first'); break;
                case 1: assert(strip(file) === 'second'); break;
                case 2: assert(strip(file) === 'third'); done(); break;
              }
            });

          });
        });
      });
    });
});

describe('#remove', function() {
  it('removes the latest file in the given destination', function(done) {
    sq.generate(dest, { suffix: '1' }, function(err, file1) {
      sq.generate(dest, { suffix: '2' }, function(err, file2) {
        sq.remove(dest, function(err) {
          assert(err === null);
          assert(fs.existsSync(file1));
          assert(!fs.existsSync(file2));
          done();
        });
      });
    });
  });
});
});


function recreateTemp(done) {
  rimraf(dest, function(err) {
    if (err) throw err;
    fs.mkdirSync(dest);
    done();
  });
}

function strip(file) {
  return file.replace(dest, '').replace(/[0-9]/g, '');
}
