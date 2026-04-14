import fastifyPlugin from "fastify-plugin";
import fastifyMongodb, { FastifyMongodbOptions } from "@fastify/mongodb";
import { FastifyInstance } from "fastify";

async function dbConnector(
  fastify: FastifyInstance,
  options: FastifyMongodbOptions,
) {
  fastify.register(fastifyMongodb, {
    url: "mongodb://localhost:27017/insights",
  });
}

export default fastifyPlugin(dbConnector);
