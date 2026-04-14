import { type FastifyPluginAsync } from "fastify";
import { listEmailsFromSenders } from "../service/gmail";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Step 3: Fetch emails by sender domains and date
};

export default root;
