import { Medication, MEDICATION_DATABASE } from '@/constants/medications';

export const processImage = async (uri: string): Promise<Medication> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate OCR and Verification logic
      // In a real app, this would upload the image to Cloud Vision API
      // and then search the returned text in MEDICATION_DATABASE.

      // For demo purposes, we will return a random medication from our database
      const randomIndex = Math.floor(Math.random() * MEDICATION_DATABASE.length);
      const result = MEDICATION_DATABASE[randomIndex];

      resolve(result);
    }, 2000); // 2 second delay to simulate processing
  });
};

// Helper for fuzzy search (placeholder for future implementation)
export const searchMedication = (text: string): Medication | null => {
  const normalizedText = text.toLowerCase();
  return MEDICATION_DATABASE.find(med =>
    normalizedText.includes(med.name.toLowerCase())
  ) || null;
};
