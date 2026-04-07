export const CONDITION_OPTIONS = [
  { val: 'needs-work',       label: 'Needs work',       sub: 'Repairs needed before renting',     icon: 'dashicons-admin-tools' },
  { val: 'rent-ready',       label: 'Rent-ready',        sub: 'Clean, functional, no major issues', icon: 'dashicons-admin-home' },
  { val: 'updated',          label: 'Updated',           sub: 'Modern finishes, recent upgrades',   icon: 'dashicons-star-filled' },
  { val: 'fully-renovated',  label: 'Fully renovated',   sub: 'Top-tier finishes, like new',        icon: 'dashicons-yes' },
];

export const USAGE_OPTIONS = [
  { val: 'long-term',    label: 'Long-term rental',  icon: 'dashicons-calendar-alt' },
  { val: 'mid-term',     label: 'Mid-term rental',   icon: 'dashicons-clock' },
  { val: 'short-term',   label: 'Short-term rental', icon: 'dashicons-tickets-alt' },
  { val: 'vacant',       label: 'Vacant',            icon: 'dashicons-dismiss' },
  { val: 'owner',        label: 'Owner occupied',    icon: 'dashicons-admin-users' },
];

export const PITI_OPTIONS = [
  { val: 750,   label: 'Under $1,000' },
  { val: 1250,  label: '$1,000–$1,500' },
  { val: 1750,  label: '$1,500–$2,000' },
  { val: 2250,  label: '$2,000–$2,500' },
  { val: 2900,  label: '$2,500+' },
  { val: 'not-sure',  label: 'Not sure' },
];

export const LOAN_OPTIONS = [
  { val: 75000,   label: 'Under $100K' },
  { val: 150000,  label: '$100K–$200K' },
  { val: 250000,  label: '$200K–$300K' },
  { val: 400000,  label: '$300K–$500K' },
  { val: 600000,  label: '$500K+' },
  { val: 'not-sure',  label: 'Not sure' },
];

export const GOAL_OPTIONS = [
  { val: 'maximize-cashflow', label: 'Maximize cash flow',  sub: 'Squeeze every dollar',          icon: 'dashicons-money-alt' },
  { val: 'reduce-headaches',  label: 'Reduce headaches',    sub: 'Less management, more freedom', icon: 'dashicons-shield' },
  { val: 'sell-soon',         label: 'Sell soon',           sub: 'Exit in next 1–2 years',        icon: 'dashicons-cart' },
  { val: 'not-sure',          label: 'Not sure',            sub: 'Just exploring options',        icon: 'dashicons-editor-help' },
];

export const BEDS_OPTIONS   = ['1', '2', '3', '4', '5+'];
export const BATHS_OPTIONS  = ['1', '1.5', '2', '2.5', '3', '4+'];
export const SQFT_OPTIONS   = ['Under 1,000', '1,000–1,500', '1,500–2,000', '2,000–3,000', '3,000+'];
export const GARAGE_OPTIONS = ['Yes', 'No', 'Attached', 'Detached', 'Not sure'];
export const ATTIC_OPTIONS  = ['Finished', 'Unfinished usable', 'Not usable', 'No attic', 'Not sure'];
