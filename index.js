// core
const { createReadStream, promises: { mkdtemp } } = require('fs')

// npm
const fastify = require('fastify')({
  logger: true
})

fastify.register(require('fastify-formbody'))

const uploadRoot = 'uploaded/'

mkdtemp(uploadRoot)
.then(console.log)
.catch(console.error)

// Pas besoin dans charcre, c'est juste un banal textarea dans un form.
// Tu voudras document.querySelector('svg').innertext ou quelque chose comme ça
fastify.get('/', async (request, reply) => {
  reply.type('text/html; charset=utf-8')
  return `<form method="post"><textarea name="cnt"></textarea><br><button>send</button></form><script src="/main.js"></script>`
})

fastify.get('/main.js', async (request, reply) => createReadStream('./client-js/main.js', 'utf8'))

// handle either text/plain or application/json
fastify.post('/', async (request) => {
  return { hello: 'world', cnt: typeof request.body === 'string' ? request.body : request.body.cnt }
})

// Run the server!
fastify.listen(4000, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
