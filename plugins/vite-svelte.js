'use strict'

import { fastifyPlugin as fp } from 'fastify-plugin';
import path from "node:path";
import { render } from 'svelte/server';
import fastifyVite from "@fastify/vite";

// Needs to point to directory containing the Vite.config.js file
const root = path.resolve(import.meta.dirname, '..')

/**
 * @see https://github.com/fastify/fastify-vite
 */
export default fp(async function (fastify, opts) {
    console.log("isDev", fastify.config.isDev)

    await fastify.register(fastifyVite, {
        dev: !!fastify.config.isDev,
        root: root,
        createRenderFunction(options) {
            return () => {
                return {element: render(options.Page).body};
            }
        }
    });


    fastify.get('/client/', (req, reply) => {
        reply.type('text/html').code(200);
        return reply.html()
    })

    await fastify.vite.ready();
    console.log('Vite is ready');

});
