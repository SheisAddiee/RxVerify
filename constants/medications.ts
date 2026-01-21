export interface Medication {
  id: string;
  name: string;
  usage: string;
  warnings: string[];
  verified: boolean;
  type: 'safe' | 'risk';
}

export const MEDICATION_DATABASE: Medication[] = [
  {
    id: '1',
    name: 'Panadol',
    usage: 'Take 1-2 tablets every 4-6 hours. Do not exceed 8 tablets in 24 hours.',
    warnings: ['Contains Paracetamol', 'Do not take with other paracetamol products'],
    verified: true,
    type: 'safe',
  },
  {
    id: '2',
    name: 'Amoxil',
    usage: 'Take 1 capsule every 8 hours. Complete the full course.',
    warnings: ['Contains Penicillin', 'May cause allergic reaction'],
    verified: true,
    type: 'safe',
  },
  {
    id: '3',
    name: 'Lipitor',
    usage: 'Take 1 tablet daily at the same time.',
    warnings: ['Avoid grapefruit juice', 'May cause muscle pain'],
    verified: true,
    type: 'safe',
  },
  {
    id: '4',
    name: 'Ibuprofen',
    usage: 'Take with food to avoid stomach upset.',
    warnings: ['Do not take if you have stomach ulcers', 'May increase risk of heart attack'],
    verified: true,
    type: 'safe',
  },
  {
    id: '5',
    name: 'Unknown Pills',
    usage: 'Unknown usage. Consult a doctor immediately.',
    warnings: ['Verification Failed', 'Potential Counterfeit'],
    verified: false,
    type: 'risk',
  },
];
