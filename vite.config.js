import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { svelte as viteSvelte } from '@sveltejs/vite-plugin-svelte'
import { ensureESMBuild } from '@fastify/vite/utils'
import { defineConfig } from 'vite'
// import { viteFastify } from '@fastify/vite'

const path = fileURLToPath(import.meta.url)
const root = resolve(dirname(path), 'client')
console.log('root', root, path)

const plugins = [
    //viteFastify(),
    viteSvelte(),
    ensureESMBuild()
]

export default defineConfig({
    root,
    plugins
});
