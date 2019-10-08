// npm
// copy .env.example to .env and adapt as needed
require('dotenv-safe').config()
const fastify = require('fastify')({ logger: true })

// core
const { createReadStream, promises: { mkdtemp, writeFile } } = require('fs')

const { UPLOAD_PORT, UPLOAD_HOST, UPLOAD_ROOT_FS, UPLOAD_ROOT_URL } = process.env

// This is where svg files are downloaded from.
fastify.get(`${UPLOAD_ROOT_URL}:id/file.svg`, (request, reply) => {
  const out = createReadStream(`${UPLOAD_ROOT_FS}${request.params.id}/file.svg`, 'utf8')
  out.once('error', (e) => {
    if (e.code === 'ENOENT') return reply.code(404).send('Not found.')
    reply.code(500).send('Oupsy daisy.')
  })
  out.once('ready', () => reply.type('image/svg+xml').send(out))
})

fastify.put('/', async (request) => {
  if (!request.body || typeof request.body !== 'string') throw new Error('Missing cnt')
  const cnt = request.body
  const dir = await mkdtemp(UPLOAD_ROOT_FS)
  const fn = `${dir}/file.svg`
  await writeFile(fn, cnt)
  return { url: fn.replace(UPLOAD_ROOT_FS, UPLOAD_ROOT_URL), size: cnt.length }
})

// Run the server!
fastify.listen(UPLOAD_PORT || 4000, UPLOAD_HOST || 'localhost', (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
