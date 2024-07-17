enum MimeTypes {
  // Dokumen Teks
  TXT = 'text/plain',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PDF = 'application/pdf',

  // File Gambar
  JPG = 'image/jpeg',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  BMP = 'image/bmp',

  // File Video
  MP4 = 'video/mp4',
  AVI = 'video/x-msvideo',
  MOV = 'video/quicktime',
  MKV = 'video/x-matroska',

  // File Audio
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  AAC = 'audio/aac',

  // File Spreadsheet
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CSV = 'text/csv',

  // File Presentasi
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // File Archive
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed',
}

/**
 * Get MIME type from file extension
 * @param {string} ext The file extension
 * @return {MimeType | undefined} The corresponding MIME type or undefined if not found
 */
export function getMimeType(ext: string): MimeTypes | undefined {
  switch (ext.toLowerCase()) {
    case '.txt':
      return MimeTypes.TXT;
    case '.doc':
      return MimeTypes.DOC;
    case '.docx':
      return MimeTypes.DOCX;
    case '.pdf':
      return MimeTypes.PDF;
    case '.jpg':
    case '.jpeg':
      return MimeTypes.JPG;
    case '.png':
      return MimeTypes.PNG;
    case '.gif':
      return MimeTypes.GIF;
    case '.bmp':
      return MimeTypes.BMP;
    case '.mp4':
      return MimeTypes.MP4;
    case '.avi':
      return MimeTypes.AVI;
    case '.mov':
      return MimeTypes.MOV;
    case '.mkv':
      return MimeTypes.MKV;
    case '.mp3':
      return MimeTypes.MP3;
    case '.wav':
      return MimeTypes.WAV;
    case '.aac':
      return MimeTypes.AAC;
    case '.xls':
      return MimeTypes.XLS;
    case '.xlsx':
      return MimeTypes.XLSX;
    case '.csv':
      return MimeTypes.CSV;
    case '.ppt':
      return MimeTypes.PPT;
    case '.pptx':
      return MimeTypes.PPTX;
    case '.zip':
      return MimeTypes.ZIP;
    case '.rar':
      return MimeTypes.RAR;
    default:
      return undefined;
  }
}
