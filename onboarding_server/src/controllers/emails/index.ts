import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EmailServices } from "../../service/emails";

export class EmailControllers {
  constructor(pFastify: FastifyInstance) {
    this.service = new EmailServices(pFastify);
  }
  async Query(
    pFastify: FastifyInstance,
    pRequest: FastifyRequest,
    pRes: FastifyReply,
  ) {
    const { email, date, senders } = pRequest.query as Record<string, string>;

    if (!email || !date || !senders) {
      pRes.status(400).send({ error: "email, date, and senders are required" });
      return;
    }
    await this.service.Query(pFastify, email, date, senders);
  }
  private service: EmailServices;
}
