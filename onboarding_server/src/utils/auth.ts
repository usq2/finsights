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
  return tokens;
};

export const ensureValidToken = async (
  oAuth2Client: OAuth2Client,
): Promise<boolean> => {
  const credentials = oAuth2Client.credentials;

  // Check if token exists
  if (!credentials.access_token) {
    throw new Error("No access token available. Please authenticate first.");
  }

  // Check if token is expired
  const isExpired = credentials.expiry_date
    ? Date.now() >= credentials.expiry_date
    : true;

  if (isExpired) {
    // Check if we have a refresh token to get new access token
    if (!credentials.refresh_token) {
      throw new Error(
        "Token expired and no refresh token available. Please re-authenticate.",
      );
    }

    try {
      const { credentials: newCredentials } =
        await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(newCredentials);
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw new Error(
        "Failed to refresh expired token. Please re-authenticate.",
      );
    }
  }

  return true;
};
