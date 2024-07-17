import path from "path";
import fs from "fs";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { googleConstant } from "@/constant/google";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const PAYLOAD_INIT = {
  type: "authorized_user",
  client_id: process.env.CLIENT_ID!,
  client_secret: process.env.CLIENT_SECRET!,
  refresh_token: process.env.REFRESH_TOKEN!,
};
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  googleConstant.credentialPath
);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
export async function loadSavedCredentialsIfExist() {
  try {
    return google.auth.fromJSON(PAYLOAD_INIT) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
export async function saveCredentials(client: any) {
  const payload = {
    type: "authorized_user",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: client.credentials.refresh_token,
  };
  return payload;
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
