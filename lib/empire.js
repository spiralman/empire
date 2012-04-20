if (global.GENTLY) require = GENTLY.hijack(require);

var path = require('path');
var fs = require('fs');

var flatiron = require('flatiron');

exports.name = 'empire';

try {
  var jade = require('jade');
  
  exports.jade = {
    extension : 'jade',
    compile : function (template) {
      return jade.compile(template);
    }
  }
}
catch (ex) {
  // Jade not available
}

exports.attach = function (options) {
  var app = this;
  
  app.empire = app.empire || {};
  
  app.empire = flatiron.common.mixin({}, app.empire, options || {});
  
  app.empire.compiler = app.empire.compiler || exports.jade;
  app.empire.viewdir = app.empire.viewdir || '.';
  app.empire.views = app.empire.views || {};
  
  app.empire.renderResponse = function (response, name, context) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.end(app.empire.views[name].render(context));
  };
  
  app.empire._checkAndRender = function (response, name, context) {
    var viewFilename = path.join(app.empire.viewdir, name + '.' + app.empire.compiler.extension);
  
    fs.stat(viewFilename, function (error, stats) {
      if (error) {
        throw error;
      }
      
      if (!app.empire.views.hasOwnProperty(name) 
          || app.empire.views[name].lastCompiled.getTime() < stats.mtime.getTime()) {
        fs.readFile(viewFilename, function (error, data) {
          if (error) {
            throw error;
          }
          
          app.empire.views[name] = {
            lastCompiled : new Date(),
            render : app.empire.compiler.compile(data)
          };
          
          app.empire.renderResponse(response, name, context);
        });
      }
      else {
        app.empire.renderResponse(response, name, context);
      }
    });
  };
  
  // Current version of Director on NPM (1.0.9-1) doesnt support the attach function
  // but, we want to add render to the "this" of the route handler with the following.
  // It will allow responses to render their data via:
  // this.render('view_name', context);
  if (app.router && typeof(app.router.attach) === 'function') {
    app.router.attach(function (name, context) {
      app.empire._checkAndRender( this.res, name, context );
    });
  }
  
  app.render = function (response, name, context) {
    app.empire._checkAndRender(response, name, context);
  };
};
