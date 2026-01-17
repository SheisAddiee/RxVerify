/**
 * ocrService.js
 *
 * A utility for scanning images for text using the OCR.space API.
 * This service is responsible for handling the client-side OCR logic,
 * sending image data to the external API, and returning the extracted text.
 */

const OCR_API_ENDPOINT = 'https://api.ocr.space/parse/image';
const OCR_API_KEY = 'helloworld'; // This is a public test key

/**
 * Scans a base64 encoded image for text using the OCR.space API.
 *
 * @param {string} base64Image The base64 encoded string of the image to be scanned.
 * @returns {Promise<string>} A promise that resolves with the extracted text, or rejects with an error.
 */
export const scanImageForText = async (base64Image) => {
  // Defensive check for input
  if (!base64Image || typeof base64Image !== 'string') {
    return Promise.reject(new Error('Invalid base64 image string provided.'));
  }

  try {
    // The OCR.space API requires the base64 image to be prefixed
    // with a data URI scheme to correctly interpret the file type.
    const imageData = `data:image/jpeg;base64,${base64Image}`;

    // We use FormData to construct the multipart/form-data request body
    // that the OCR.space API expects.
    const formData = new FormData();
    formData.append('base64Image', imageData);
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng'); // Specify English language for better accuracy

    const response = await fetch(OCR_API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const result = await response.json();

    // The OCR.space API response contains a 'ParsedResults' array.
    // We check if it exists and if the first result has parsed text.
    if (result.ParsedResults && result.ParsedResults.length > 0) {
      const parsedText = result.ParsedResults[0].ParsedText;
      if (parsedText && parsedText.trim().length > 0) {
        return parsedText;
      }
    }

    // If no text is found or the API response is malformed, throw an error.
    if (result.IsErroredOnProcessing) {
        throw new Error(`OCR processing error: ${result.ErrorMessage.join(', ')}`);
    }

    throw new Error('No text could be extracted from the image.');

  } catch (error) {
    console.error('Error during OCR process:', error);
    // Propagate the error to be handled by the caller
    throw error;
  }
};
