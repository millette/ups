// npm
// copy .env.example to .env and adapt as needed
require('dotenv-safe').config()
const fastify = require('fastify')({ logger: true })
// only required to process normal browser forms (without ajax)
// fastify.register(require('fastify-formbody'))

// core
const { createReadStream, promises: { mkdtemp, writeFile } } = require('fs')

const { UPLOAD_PORT, UPLOAD_ROOT_FS, UPLOAD_ROOT_URL } = process.env

// Pas besoin dans charcre, c'est juste un banal textarea dans un form.
// Tu voudras document.querySelector('svg').innertext
// ou quelque chose comme ça.
/*
fastify.get('/', async (request, reply) => {
  reply.type('text/html; charset=utf-8')
  return `<form method="post"><textarea name="cnt"></textarea><br><button>send</button></form><script src="/main.js"></script>`
})
*/

// This is where svg files are downloaded from
// the file name (file.svg) could probably be derived
// on charcre's end from the character's name.

fastify.get(`${UPLOAD_ROOT_URL}:id/file.svg`, (request, reply) => {
  const out = createReadStream(`${UPLOAD_ROOT_FS}${request.params.id}/file.svg`, 'utf8')
  out.once('error', (e) => {
    if (e.code === 'ENOENT') return reply.code(404).send('Not found.')
    reply.code(500).send('Oupsy daisy.')
  })
  out.once('ready', () => reply.type('image/svg+xml').send(out))
})

// only needed to demo our form/ajax
// fastify.get('/main.js', async (request, reply) => createReadStream('client-js/main.js', 'utf8'))

// handle either text/plain or application/json
/*
fastify.post('/', async (request) => {
  const cnt = typeof request.body === 'string' ? request.body : request.body.cnt
  if (!cnt) throw new Error('Missing cnt')
  const dir = await mkdtemp(UPLOAD_ROOT_FS)
  const fn = `${dir}/file.svg`
  await writeFile(fn, cnt)
  return { url: `${UPLOAD_ROOT_FS}${fn}`, size: cnt.length }
})
*/

fastify.put('/', async (request) => {
  // const cnt = typeof request.body === 'string' ? request.body : request.body.cnt
  if (!request.body || typeof request.body !== 'string') throw new Error('Missing cnt')
  const cnt = request.body
  const dir = await mkdtemp(UPLOAD_ROOT_FS)
  const fn = `${dir}/file.svg`
  await writeFile(fn, cnt)
  return { url: `${UPLOAD_ROOT_FS}${fn}`, size: cnt.length }
})

// Run the server!
fastify.listen(UPLOAD_PORT || 4000, UPLOAD_HOST || 'localhost', (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
