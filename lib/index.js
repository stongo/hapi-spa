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


    internals._addSPA = function (spaOptions) {

        plugin.hapi.utils.assert(typeof spaOptions === 'object', 'Plugin options must be an object or array of objects');

        var settings = plugin.hapi.utils.applyToDefaults(internals.defaults, spaOptions);

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
        };

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

            if (request.route.path === settings.path && request.params.file.indexOf(settings.index) !== 0 && request.params.file !== null && error.output.statusCode === 404) {

                var tryIndex;

                if (settings.autoIndex) {
                    tryIndex = [settings.hash, request.params.file].join('');
                }
                else {
                    tryIndex = [settings.index, settings.hash, request.params.file].join('');
                }

                return reply('success').redirect(tryIndex);

            }
            else {

                return reply(error.output.message);
            }
        });
    };

    if (options instanceof Array) {
        for (var i = 0, length = options.length; i < length; i++) {
            internals._addSPA(options[i]);
        }
    }
    else {
        internals._addSPA(options);
    }

    next();
};