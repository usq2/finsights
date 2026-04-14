import fastifyPlugin from "fastify-plugin";
import fastifyMongodb, { FastifyMongodbOptions } from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { Tokens } from "../models";

async function dbConnector(
  fastify: FastifyInstance,
  options: FastifyMongodbOptions,
) {
  fastify.register(fastifyMongodb, {
    url: "mongodb://mongodb:27017/insights",
    database: "insights",
  });
  // wait for mongodb to be ready
  await fastify.after();
  // add a custom object for handling queries on mongo db for each of the required collection
  fastify.log.error("Database initialised");
  const db = fastify.mongo.db;
  const collections = {
    tokens: db?.collection<Tokens>("tokens")!,
  };

  fastify.decorate("db", collections);
  fastify.log.info("Databases Collections decorated successfully!");
}
export default fastifyPlugin(dbConnector);
