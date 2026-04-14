import { mongodb } from "@fastify/mongodb";
import { Tokens, Emails } from "../models";
declare module "fastify" {
  interface FastifyInstance {
    db: {
      tokens: mongodb.Collection<Tokens>;
    };
  }
}
