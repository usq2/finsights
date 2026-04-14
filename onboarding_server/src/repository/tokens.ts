import { type FastifyInstance } from "fastify";
import { Tokens } from "../models";
import { mongodb } from "@fastify/mongodb";

export class TokensRepo {
  constructor(pFastify: FastifyInstance) {
    this.tokens = pFastify.db?.tokens;
  }
  async setToken(pEmail: string, pTokens: Tokens) {
    try {
      pTokens.email = pEmail;
      const result = await this.tokens?.updateOne(
        { email: pEmail },
        {
          $set: {
            ...pTokens,
          },
        },
        {
          upsert: true,
        },
      );
      if (result.upsertedCount) {
        return true;
      }
    } catch (ex) {
      return null;
    }
  }
  async getTokens(pEmail: string) {
    try {
      const result = await this.tokens.findOne({ email: pEmail });
      if (result) {
        return result;
      }
    } catch (ex) {
      return null;
    }
  }
  private tokens: mongodb.Collection<Tokens>;
}
