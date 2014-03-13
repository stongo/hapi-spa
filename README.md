# hapi-spa

Serve a single page app with hapi

## Getting Started
Install **hapi-spa** by either running `npm install hapi-spa` in your sites working directory or add 'hapi-spa' to the dependencies section of the 'package.json' file and run npm install.

### Required permissions
**hapi-spa** requires the following permissions to be granted on the server for the plugin to work correctly:
   - route
   - events
   - ext

### Available options
```
{
    folder: '/', // Required in plugin options - specifies location of SPA files
    path: '/', // Optional - route path
    index: 'index.html', // Optional - SPA index file
    autoIndex: true, // Optional - default directory handler setting
    redirectToSlash: false, // Optional - disables default directory handler setting
    hash: '/#!/' // Optional - Hash or other leading character SPA router uses
}
```

An array of options can be used to register multiple single page apps


### Example
```
var Hapi = require('hapi');

var server = new Hapi.Server(8000, { files: { relativeTo: '/' } });

server.pack.require('hapi-spa', { folder: '/var/www/app/'}, function(err) {
  if (err) throw err;
  console.log('loaded hapi-spa');
});

server.start();
```

#### Multiple SPAs

```
var Hapi = require('hapi');

var server = new Hapi.Server(8000, { files: { relativeTo: '/' } });

server.pack.require('hapi-spa', [{ path: '/app1/, folder: '/var/www/app1/'}, { path: '/app2/, folder: '/var/www/app2/'}], function(err) {
  if (err) throw err;
  console.log('loaded hapi-spa');
});

server.start();
```