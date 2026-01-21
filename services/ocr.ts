import * as FileSystem from 'expo-file-system';

// Note: 'helloworld' is a public demo key with strict rate limits.
// For production, replace with a valid API Key from OCR.space.
const OCR_API_KEY = 'helloworld';
const OCR_API_URL = 'https://api.ocr.space/parse/image';

export async function performOCR(imageUri: string): Promise<string[]> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const formData = new FormData();
    formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');

    // Note: In React Native, FormData works for multipart/form-data.
    // However, for OCR.space with base64Image, we can also send x-www-form-urlencoded or just multipart.
    // Multipart is safer for large payloads.

    const response = await fetch(OCR_API_URL, {
      method: 'POST',
      headers: {
        // Content-Type is set automatically by FormData
      },
      body: formData,
    });

    const result = await response.json();

    if (result.IsErroredOnProcessing) {
        console.error("OCR Error:", result.ErrorMessage);
        return [];
    }

    if (result.ParsedResults && result.ParsedResults.length > 0) {
      const text = result.ParsedResults[0].ParsedText;
      // Split by newlines and filter empty
      return text.split(/\r?\n/).map((line: string) => line.trim()).filter((line: string) => line.length > 0);
    }

    return [];
  } catch (error) {
    console.error("OCR Service Error:", error);
    return [];
  }
}
