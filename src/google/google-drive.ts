import { getMimeType } from "./enum";
import { authorize } from "./auth-google";
import path from "path";
import fs from "fs";
import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

/**
 * Get or create folder in Google Drive.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {string} folderName The name of the folder to search or create.
 * @return {Promise<any>} The folder ID.
 */
export async function getOrCreateFolder(authClient: any, folderName: string) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    fields: "files(id, name)",
    spaces: "drive",
  });

  let folder = res.data.files?.[0];

  if (!folder) {
    const fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };

    const folderCreation = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });

    folder = folderCreation.data;
  }

  return folder;
}

export async function checkIfFileExists(
  authClient: OAuth2Client,
  folderId: string,
  fileName: string
): Promise<boolean> {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
    q: `'${folderId}' in parents and name='${fileName}' and trashed=false`,
    fields: "files(id, name)",
  });

  return res.data.files ? res.data.files && res.data.files.length > 0 : false;
}
/**
 * Upload a file to Google Drive.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {string} filePath The path to the file to upload.
 */
export async function uploadFile(authClient: OAuth2Client, filePath: string) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const folderName = "LMS";
  const folder = await getOrCreateFolder(authClient, folderName);

  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath);
  const mimeType = getMimeType(fileExt);

  // Check if the detected MIME type is supported
  if (!mimeType) {
    console.error(`Unsupported file type: ${fileExt}`);
    return;
  }

  if (!folder.id) {
    console.error("No folder found");
    return new Error(`No folder ${folderName}`);
  }

  // Check if a file with the same name already exists
  const fileExists = await checkIfFileExists(authClient, folder.id, fileName);
  if (fileExists) {
    console.error(
      `Filed with name "${fileName}" already exists in folder "${folderName}".`
    );
    return;
  }

  const fileMetadata = {
    name: fileName,
    parents: [folder.id], // Set the folder as parent
  };
  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  try {
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    console.log("File Id:", file.data.id);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

/**
 * List files in a folder in Google Drive.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {string} folderName The name of the folder to list files from.
 * @return {Promise<any[]>} A promise that resolves to an array of files.
 */
export async function listFilesInFolder(
  authClient: OAuth2Client,
  folderName: string
): Promise<drive_v3.Schema$File[]> {
  const drive = google.drive({ version: "v3", auth: authClient });
  const folder = await getOrCreateFolder(authClient, folderName);

  const res = await drive.files.list({
    q: `'${folder.id}' in parents and trashed=false`,
    fields: "files(id, name)",
  });

  if (res.data.files?.length) {
    return res.data.files;
  } else {
    return [];
  }
}

// authorize()
//   .then((authClient) => {
//     // Replace this with the path to the file you want to upload
//     const filePath = "test.pdf";
//     return uploadFile(authClient, filePath);
//   })
//   .catch(console.error);

// Example usage:
// authorize()
//   .then((authClient) => {
//     return listFilesInFolder(authClient, "LMS");
//   })
//   .then((files) => {
//     console.log("Files:", JSON.stringify(files, null, 2));
//   })
//   .catch(console.error);

// const authClient = await authorize();
// const data = await listFilesInFolder(authClient, googleConstant.driveFolder);