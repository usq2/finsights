import fastifyEnv, { FastifyEnvOptions } from "@fastify/env";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

const schema = {
  type: "object",
  required: ["REDIRECT_URI", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
  properties: {
    REDIRECT_URI: { type: "string" },
    GOOGLE_CLIENT_ID: { type: "string" },
    GOOGLE_CLIENT_SECRET: { type: "string" },
  },
};

async function envLoader(fastify: FastifyInstance, options: FastifyEnvOptions) {
  fastify.register(fastifyEnv, {
    confKey: "config", // Access via fastify.config
    schema: schema,
    dotenv: true, // Auto-load .env file
  });
}

export default fastifyPlugin(envLoader);
