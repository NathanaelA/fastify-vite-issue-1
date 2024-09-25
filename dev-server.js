'use strict';

import path from 'node:path';
import AutoLoad from '@fastify/autoload';

import config from './config.js';
config.isDev = true;


// Pass --options via CLI arguments in command to enable these options.
export const options = {};

export default async function (fastify, opts) {

  // Allow access to config in routes/plugins
  fastify.decorate('config', config);

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'routes'),
    options: Object.assign({}, opts)
  });
}

