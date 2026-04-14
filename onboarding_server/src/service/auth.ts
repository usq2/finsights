import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Tokens } from "./types";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

export const createOAuthClient = (fastify: any): OAuth2Client => {
  return new google.auth.OAuth2(
    fastify.config.GOOGLE_CLIENT_ID,
    fastify.config.GOOGLE_CLIENT_SECRET,
    fastify.config.REDIRECT_URI,
  );
};

export const getAuthUrl = (oAuth2Client: OAuth2Client): string => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
};

export const getTokenFromCode = async (
  oAuth2Client: OAuth2Client,
  code: string,
): Promise<Tokens> => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  console.log("Access Token", await oAuth2Client.getAccessToken());
  return tokens;
};
