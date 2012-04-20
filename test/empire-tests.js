var path = require('path');
var broadway = require('broadway');

var gently = global.GENTLY = new (require('gently'));
var empire = require('../lib/empire.js');

describe('render with default options', function(){
  before( function() {
    this.app = new broadway.App();
    this.app.use(empire);
    this.app.init();
  });
  
  it('should call stat', function() {
    gently.expect(gently.hijacked.fs, 'stat', function (filePath, callback) {
      filePath.should.equal(path.join('.', 'viewname') + '.jade');
    });
    
    this.app.render(null, 'viewname');
  });
});
