export interface Email {
  subject: string | null;
  from: string | null;
  date: string | null;
  body: string;
}

export interface UserTokens {
  [email: string]: Tokens;
}

export interface Tokens {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
}
