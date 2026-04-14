import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createOAuthClient } from "../../service/auth";
import { listEmailsFromSenders } from "../../service/gmail";

export class EmailControllers {
  async Query(
    pRequest: FastifyRequest,
    pRes: FastifyReply,
    pFastify: FastifyInstance,
  ) {
    const { email, date, senders } = pRequest.query as Record<string, string>;

    if (!email || !date || !senders) {
      pRes.status(400).send({ error: "email, date, and senders are required" });
      return;
    }

    const tokens = userTokens[email];
    if (!tokens) {
      pRes
        .status(401)
        .send({ error: "User not connected. Visit /auth/gmail first." });
      return;
    }

    const oAuth2Client = createOAuthClient(pFastify);
    oAuth2Client.setCredentials(tokens);

    const senderList = senders.split(",").map((s) => s.trim());
    const emails = await listEmailsFromSenders(oAuth2Client, senderList, date);

    pRes.send({ count: emails.length, emails });
  }
}
