import { PlanId } from './types';

export const STEPS = ['Details', 'Plan', 'Payment', 'Finish'] as const;

export const PLANS: {
  id: PlanId;
  name: string;
  price: number | string;
  features: string[];
}[] = [
  {
    id: 'rookie',
    name: 'Rookie',
    price: 9.99,
    features: [
      'Basic match insights',
      '20 queries per day',
      'Static team stats',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    features: [
      'Unlimited queries',
      'Live injury news (Perplexity)',
      'Odds comparison',
      'Advanced AI analysis',
    ],
  },
  {
    id: 'sharp',
    name: 'Sharp',
    price: 99.99,
    features: [
      'Priority support',
      'Real-time API sports data',
      'Claude 3.7 reasoning',
      'Multi-step research',
    ],
  },
];