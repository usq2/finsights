import { FastifyPluginAsync } from "fastify";
import EmailRoutes from "./email";
import OnboardingRoutes from "./onboarding";

const routes: FastifyPluginAsync = async (pFastify, pOpts) => {
  pFastify.register(OnboardingRoutes);
  pFastify.register(EmailRoutes);
};

export default routes;
