/**
 * File validation utilities for resume uploads
 * Validates both file extension and actual content
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate file content based on expected type
 */
export const validateFileContent = (
  buffer: Buffer,
  mimetype: string
): FileValidationResult => {
  try {
    // Check file signature (magic bytes) for different file types
    const signature = buffer.subarray(0, 8);

    switch (mimetype) {
      case "application/pdf":
        // PDF files start with %PDF-
        if (buffer.length < 4) {
          return { isValid: false, error: "File too small to be a valid PDF" };
        }
        const pdfSignature = buffer.subarray(0, 5).toString();
        if (pdfSignature !== "%PDF-") {
          return {
            isValid: false,
            error: "Invalid PDF file - missing PDF signature",
          };
        }
        return { isValid: true };

      case "application/msword":
        // DOC files start with D0 CF 11 E0 A1 B1 1A E1 (OLE2 signature)
        const docSignature = Array.from(signature.subarray(0, 8));
        const expectedDocSignature = [
          0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1,
        ];
        if (
          !docSignature.every(
            (byte, index) => byte === expectedDocSignature[index]
          )
        ) {
          return {
            isValid: false,
            error: "Invalid DOC file - missing OLE2 signature",
          };
        }
        return { isValid: true };

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        // DOCX files are ZIP files with specific structure
        // Check for PK header (ZIP file signature)
        if (signature[0] !== 0x50 || signature[1] !== 0x4b) {
          return {
            isValid: false,
            error: "Invalid DOCX file - not a valid ZIP archive",
          };
        }

        // Additional check: look for [Content_Types].xml which should be in DOCX files
        const contentTypesIndex = buffer.indexOf("[Content_Types].xml");
        if (contentTypesIndex === -1) {
          return {
            isValid: false,
            error: "Invalid DOCX file - missing required content",
          };
        }

        return { isValid: true };

      default:
        return { isValid: false, error: `Unsupported file type: ${mimetype}` };
    }
  } catch (error) {
    return { isValid: false, error: `File validation error: ${error.message}` };
  }
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

/**
 * Validate file extension matches allowed types
 */
export const validateFileExtension = (
  filename: string
): FileValidationResult => {
  const extension = getFileExtension(filename);
  const allowedExtensions = ["pdf", "doc", "docx"];

  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Invalid file extension. Only PDF, DOC, and DOCX files are allowed. Got: .${extension}`,
    };
  }

  return { isValid: true };
};

/**
 * Comprehensive file validation (extension + content)
 */
export const validateFile = (
  buffer: Buffer,
  filename: string,
  mimetype: string
): FileValidationResult => {
  // First validate extension
  const extensionValidation = validateFileExtension(filename);
  if (!extensionValidation.isValid) {
    return extensionValidation;
  }

  // Then validate content
  const contentValidation = validateFileContent(buffer, mimetype);
  if (!contentValidation.isValid) {
    return contentValidation;
  }

  return { isValid: true };
};
