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

Options
=======

The `empire` plugin has the following options, which may be passed into `app.use()`

`viewdir`
---------

A string containing the directory to search for view templates.

`compiler`
----------

The compiler is an object used to compile view templates into Javascript functions. It
should hove two properties:

    {
      extension : 'jade',
      compile : function (template) {
        return jade.compile(template);
      }
    }

`extension` is a string which will be used as the file extension while looking for view
templates. `compile` is a function which accepts the contents of the view template file 
and returns a function which should take a context and return the rendered HTML.

If none is specified, and the [jade](http://jade-lang.org) module is available, the default
`jade` compiler will be used. (The Jade compiler is also exported as `empire.jade` if you
want to specify it explicitly).

`views`
-------

If you want to provide pre-compiled views, you can pass them in via the options. The views
are simply an object which map the view name to the function returned by the compiler's 
`compile` function. The view function should take a single context object, as passed into
`render()`.
