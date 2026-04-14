import { type FastifyPluginAsync } from "fastify";
import { OnboardingControllers } from "../../controllers/onboarding";

const OnboardingControllersInstance = new OnboardingControllers();

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/auth/gmail", (_request, reply) => {
    OnboardingControllersInstance.InitiateAuth(fastify, reply);
  });

  // Step 2: OAuth callback
  fastify.get("/auth/callback", async (request, reply) => {
    await OnboardingControllersInstance.AuthCallback(fastify, request, reply);
  });
};

export default auth;
