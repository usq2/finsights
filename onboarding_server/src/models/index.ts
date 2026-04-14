import { ObjectId } from "@fastify/mongodb";

export interface Tokens {
  _id: ObjectId;
  email: string;
  access_token: string;
  expiry_date: number;
  id_token: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token: string;
}

export interface Emails {
  _id: ObjectId;
  email: string;
  date: string;
  body: unknown;
}
