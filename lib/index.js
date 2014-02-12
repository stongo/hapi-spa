// Declare internals

var internals = {};

// Defaults

internals.defaults = {
    folder: '/', // Required in plugin options - specifies location of SPA files
    path: '/', // Optional - route path
    index: 'index.html', // Optional - SPA index file
    autoIndex: true, // Optional - default directory handler setting
    redirectToSlash: false, // Optional - disables default directory handler setting
    hash: '/#!/' // Optional - Hash or other leading character SPA router uses
};

exports.register = function (plugin, options, next) {

    plugin.hapi.utils.assert(typeof plugin.route === 'function', 'Plugin permissions must allow route');
    plugin.hapi.utils.assert(typeof plugin.events === 'object', 'Plugin permissions must allow events');
    plugin.hapi.utils.assert(typeof plugin.ext === 'function', 'Plugin permissions must allow ext');

    var settings = plugin.hapi.utils.applyToDefaults(internals.defaults, options);


    // Make sure path has trailing slash
    if (settings.path.lastIndexOf('/') !== settings.path.length - 1) {

        settings.path = settings.path + '/';
    }

    settings.path = settings.path + '{file*}';

    // Default handler settings
    var handlerSettings = {
        path: settings.folder,
        index: settings.autoIndex,
        redirectToSlash: settings.redirectToSlash
    }

    plugin.route({
        method: 'GET',
        path: settings.path,
        handler: {
            directory: handlerSettings
        }
    });

    plugin.ext('onPreResponse', function (request, reply) {

        var response = request.response;

        if (!response.isBoom) {

            return reply();
        }

        // Try index.html to pass route to SPA router

        var error = response;

        if (request.route.path === settings.path && request.params.file !== settings.index && error.output.statusCode === 404) {

            var tryIndex;

            tryIndex = [settings.index, settings.hash, request.params.file].join('');

            return reply('success').redirect(tryIndex);

        }
        else {

            return reply(error.output.message);
        }

    });

    next();
};