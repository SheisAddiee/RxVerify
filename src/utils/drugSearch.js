/**
 * drugSearch.js
 *
 * This utility handles the core logic of the application. It imports the local
 * drug dataset, analyzes the text extracted from OCR, and attempts to match it
 * against known medications.
 */

// Import the local dataset of drugs.
// The `require` function is used here to directly import and parse the JSON file.
import drugs from '../../assets/data/drugs.json';

/**
 * Analyzes a string of scanned text to find a matching drug from the local database.
 *
 * @param {string} scannedText The text extracted from a medicine package by the OCR service.
 * @returns {{status: "success" | "failed", data: object | null, message: string}}
 *          An object indicating the result of the search.
 *          - 'status': "success" if a match is found, otherwise "failed".
 *          - 'data': The complete drug object if found, otherwise null.
 *          - 'message': A user-friendly message describing the outcome.
 */
export const analyzeDrugText = (scannedText) => {
  // 1. Validate the input text.
  // We need to ensure we have a non-empty string to work with.
  if (!scannedText || typeof scannedText !== 'string' || scannedText.trim().length === 0) {
    return {
      status: 'failed',
      data: null,
      message: 'No text was provided for analysis.',
    };
  }

  // 2. Normalize the input text for consistent matching.
  // - Convert to lowercase to make the search case-insensitive.
  // - Trim whitespace from the beginning and end.
  // - Replace multiple whitespace characters with a single space.
  const normalizedText = scannedText.toLowerCase().trim().replace(/\s+/g, ' ');

  // 3. Iterate through the drug list to find a match.
  // The goal is to find the first drug where either the brand name or the
  // generic name is present in the normalized OCR text.
  for (const drug of drugs) {
    const brandName = drug.brand_name.toLowerCase();
    const genericName = drug.generic_name.toLowerCase();

    // Check if the normalized text includes either the brand or generic name.
    // This simple check is effective for finding matches in text that might
    // contain other details (e.g., "Panadol 500mg tablets").
    if (normalizedText.includes(brandName) || normalizedText.includes(genericName)) {
      // 4. If a match is found, return a success response with the drug data.
      return {
        status: 'success',
        data: drug,
        message: 'Drug identified successfully.',
      };
    }
  }

  // 5. If the loop completes without finding any matches, return a failed response.
  return {
    status: 'failed',
    data: null,
    message: 'Could not identify the drug from the text. Please try scanning again.',
  };
};
