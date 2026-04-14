import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  createOAuthClient,
  getAuthUrl,
  getTokenFromCode,
} from "../../utils/auth";
import { google } from "googleapis";

export class OnboardingControllers {
  // google oAuth entry
  InitiateAuth(pFastify: FastifyInstance, pReply: FastifyReply) {
    const oAuth2Client = createOAuthClient(pFastify);
    const url = getAuthUrl(oAuth2Client);
    pReply.redirect(url);
  }

  //oAuth completion callback handler
  async AuthCallback(
    pFastify: FastifyInstance,
    pRequest: FastifyRequest,
    pReply: FastifyReply,
  ) {
    // get code
    const query = pRequest.query as { code: string };
    // get tokens from code
    const { code } = query;
    // create oauth2 client
    const oAuth2Client = createOAuthClient(pFastify);
    // get tokens from query params
    const tokens = await getTokenFromCode(oAuth2Client, code);
    const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const { data } = await oauth2.userinfo.get();
    if (!data.email) {
      pReply.status(400).send({ error: "Could not retrieve email" });
      return;
    }
    // insert into db
    const tokensCollection = pFastify.mongo.db?.collection("tokens");
    const result = await tokensCollection?.updateOne(
      { email: data.email },
      {
        $set: {
          email: data.email,
          ...tokens,
        },
      },
      {
        upsert: true,
      },
    );
    // send in response
    pReply.send({ message: "Connected!", email: data.email, result: result });
  }
}
