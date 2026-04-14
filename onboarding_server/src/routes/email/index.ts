import { type FastifyPluginAsync } from "fastify";
import { EmailControllers } from "../../controllers/emails";

const emails: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const EmailControllersInstance = new EmailControllers(fastify);
  fastify.get("/email/query", (request, reply) => {
    EmailControllersInstance.Query(fastify, request, reply);
  });
};

export default emails;
