import { type FastifyPluginAsync } from "fastify";

const emails: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/emails/by-senders", async (req, res) => {});

  // Convenience: fetch today's emails
  fastify.get("/emails/today", async (req, res) => {
    const { email, senders } = req.query as Record<string, string>;

    if (!email || !senders) {
      res.status(400).send({ error: "email and senders are required" });
      return;
    }

    const tokens = userTokens[email];
    if (!tokens) {
      res.status(401).send({ error: "User not connected." });
      return;
    }

    const oAuth2Client = createOAuthClient(fastify);
    oAuth2Client.setCredentials(tokens);

    const today = new Date().toISOString().split("T")[0];
    const senderList = senders.split(",").map((s) => s.trim());
    const emails = await listEmailsFromSenders(oAuth2Client, senderList, today);

    res.send({ count: emails.length, emails });
  });
};
