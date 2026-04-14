import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Email } from "./types";

const extractBody = (payload: any): string => {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  if (payload.parts) {
    const textPart = payload.parts.find(
      (p: any) => p.mimeType === "text/plain",
    );
    const htmlPart = payload.parts.find((p: any) => p.mimeType === "text/html");
    const part = textPart || htmlPart;

    if (part?.body?.data) {
      return Buffer.from(part.body.data, "base64").toString("utf-8");
    }
  }

  return "";
};

export const getEmail = async (
  oAuth2Client: OAuth2Client,
  messageId: string,
): Promise<Email> => {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  const headers = res.data.payload?.headers ?? [];
  const subject = headers.find((h) => h.name === "Subject")?.value ?? null;
  const from = headers.find((h) => h.name === "From")?.value ?? null;
  const date = headers.find((h) => h.name === "Date")?.value ?? null;
  const body = extractBody(res.data.payload);

  return { subject, from, date, body };
};

export const listEmailsFromSenders = async (
  oAuth2Client: OAuth2Client,
  senders: string[],
  date: string, // format: YYYY-MM-DD
): Promise<Email[]> => {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const after = new Date(date);
  const before = new Date(date);
  before.setDate(before.getDate() + 1);

  const afterStr = after.toISOString().split("T")[0];
  const beforeStr = before.toISOString().split("T")[0];

  const fromQuery = senders.map((s) => `from:${s}`).join(" OR ");
  const query = `(${fromQuery}) after:${afterStr} before:${beforeStr}`;

  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 50,
  });

  const messages = res.data.messages ?? [];

  const emails = await Promise.all(
    messages.map((m) => getEmail(oAuth2Client, m.id!)),
  );

  return emails;
};
