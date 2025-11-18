/**
 * Image handling utilities
 */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates and reads an image file, returning a data URL
 * @param {File} file - The image file to process
 * @returns {Promise<string>} Promise that resolves to the image data URL
 * @throws {Error} If file is invalid or too large
 */
export const processImageFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error("Image must be less than 5MB"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Validates if a file is an image
 * @param {File} file - The file to validate
 * @returns {boolean} True if file is an image
 */
export const isImageFile = (file) => {
  return file && file.type.startsWith("image/");
};

