const fastify = require('fastify')({
  logger: true
})

fastify.register(require('fastify-formbody'))

// Declare a route
fastify.get('/', function (request, reply) {
  reply.type('text/html').send(`<form method="post"><textarea name="cnt"></textarea><button>send
  `)
})

fastify.post('/', function (request, reply) {
  reply.send({ hello: 'world', cnt: request.body.cnt })
})

// Run the server!
fastify.listen(4000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
