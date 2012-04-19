Introduction
============

Empire is a view renderer for [flatiron](http://flatironjs.org). It provides a mechanism
to easily render a named view from a route handler.

Quick Start
-----------

Empire is implemented as a Broadway plugin, so you can simply app.use() it:

    var flatiron = require('flatiron'),
        empire = require('empire'),
        app = flatiron.app;

    app.use(flatiron.plugins.http);

    app.use(empire, {
        viewdir: __dirname + '/views'
    });

    app.router.get('/', function () {
      app.render(this.res, 'index', {});
    });

    app.start(3000);

