import { fastify } from 'fastify';
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

const database = new DatabasePostgres

server.listen({
  host: '0.0.0.0' ?? 'localhost',
  port: process.env.port ?? 3333,
})

server.get('/videos', async (request, reply) => {
  const search = request.query.search
  const videos = await database.list(search)
  return reply.status(200).send(videos)

})

server.post('/videos', async (request, reply) => {
  const { title, description, duration } = request.body


  await database.create({
    title,
    description,
    duration: duration ?? 0,
  })

  reply.status(201).send()
})

server.put('/videos/:id', async (request, reply) => {
  const id = request.params.id
  const { title, description, duration } = request.body

  const video = await database.update(id, {title, description, duration})

  

  reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
  const id = request.params.id

  await database.delete(id)

  

  reply.status(204).send()
})