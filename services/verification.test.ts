import { findMedication } from './verification';

describe('verification', () => {
  it('identifies Panadol correctly', () => {
    const texts = ['Some random text', 'Panadol Extra', '500mg'];
    const result = findMedication(texts);
    expect(result).not.toBeNull();
    expect(result?.names).toContain('Panadol');
  });

  it('identifies Amoxicillin correctly', () => {
    const texts = ['Amoxicillin 500mg', 'Capsule'];
    const result = findMedication(texts);
    expect(result).not.toBeNull();
    expect(result?.names).toContain('Amoxicillin');
  });

  it('returns null for unknown text', () => {
    const texts = ['Unknown drug', 'Candy'];
    const result = findMedication(texts);
    expect(result).toBeNull();
  });
});
