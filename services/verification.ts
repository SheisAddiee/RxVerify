import medications from '../data/medications.json';

export interface Medication {
  id: string;
  names: string[];
  description: string;
  dosage: string;
  interactions: string[];
  warnings: string;
}

export function findMedication(texts: string[]): Medication | null {
  const normalizedTexts = texts.map(t => t.toLowerCase());

  for (const med of medications) {
    for (const name of med.names) {
      // Check if any recognized text contains the medication name
      // We check if the text *includes* the name, e.g. "Panadol Extra" includes "Panadol"
      if (normalizedTexts.some(text => text.includes(name.toLowerCase()))) {
        return med as Medication;
      }
    }
  }
  return null;
}
