'use strict';

import path from 'node:path';
import AutoLoad from '@fastify/autoload';
import closeWithGrace from "close-with-grace";
import config from './config.js';
import fastify from 'fastify'


const opts ={
    logger: true
};


const server = fastify(opts);

// Allow access to config in routes/plugins
server.decorate('config', config);

// This loads all plugins defined in plugins
server.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'plugins'),
    options: Object.assign({}, opts)
});

// This loads all plugins defined in routes
server.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'routes'),
    options: Object.assign({}, opts)
});


// Graceful shutdown
closeWithGrace(async function ({ signal, err, manual }) {
    if (err) {
        server.log.error({ err }, 'server closing with error')
    } else {
        server.log.info(`${signal} received, server closing`)
    }
    await server.close()
});

// Startup Server
server.listen(config.server, function (err, address) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
})
