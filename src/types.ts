// add/update types you already have
export type Customer = {
  id: number;
  name: string;
  type: 'university' | 'hospital' | 'government' | 'industry' | 'other';
  city?: string;
  state?: string;
  potentialValue?: number;
};

export type ActivityType = 'contact' | 'meeting' | 'note';
