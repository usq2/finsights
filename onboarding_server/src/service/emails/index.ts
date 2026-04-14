import { type FastifyInstance } from "fastify";
import { createOAuthClient, ensureValidToken } from "../../utils/auth";
import { listEmailsFromSenders } from "../../utils/gmail";
import { type Credentials } from "google-auth-library";
import { TokensRepo } from "../../repository/tokens";
export class EmailServices {
  constructor(pFastify: FastifyInstance) {
    this.tokens = new TokensRepo(pFastify);
  }
  async Query(
    pFastify: FastifyInstance,
    pEmail: string,
    pDate: string,
    pSenders: string,
  ) {
    // fetch from the mongo collection
    const tokens = await this.tokens.getTokens(pEmail);
    if (!tokens) {
      return {
        status: 401,
        error: "User not connected. Visit /auth/gmail first.",
      };
    }
    let { email, ...tokenInfo } = tokens;
    const oAuth2Client = createOAuthClient(pFastify);
    oAuth2Client.setCredentials(tokenInfo as Credentials);

    await ensureValidToken(oAuth2Client);

    const senderList = pSenders.split(",").map((s) => s.trim());
    const emails = await listEmailsFromSenders(oAuth2Client, senderList, pDate);

    // insert into object store
    pFastify.log.info(emails);
  }

  private tokens;
}
