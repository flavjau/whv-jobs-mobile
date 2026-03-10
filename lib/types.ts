export type Agency = {
  id: string;
  name: string;
  tradingNames: string[];
  abn: string | null;
  category: string;
  state: string;
  contactType: string;
  city: string | null;
  address: string | null;
  postcode: string | null;
  phonePrimary: string | null;
  phoneSecondary: string | null;
  emailGeneral: string | null;
  emailCareers: string | null;
  website: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryUnit: string | null;
  latitude: number | null;
  longitude: number | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  isActive: boolean;
  is88DaysEligible: boolean;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: 'free' | 'access' | 'alerts';
  visaType: string | null;
  currentLocation: string | null;
};

export const AUSTRALIAN_STATES = [
  'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'
] as const;

export const AGENCY_CATEGORIES = [
  'Meat Processing',
  'Horticulture',
  'Construction',
  'Mining',
  'Agriculture',
  'Hospitality',
  'Fishing & Pearling',
  'Tree Farming & Felling',
] as const;
