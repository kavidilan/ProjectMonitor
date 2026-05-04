// District centroids for Sri Lanka (approximate).
// Used for district-wise pinning when projects only have `district` text.
export const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

export const DISTRICT_COORDS = {
  Ampara: { lat: 7.2912, lng: 81.6750 },
  Anuradhapura: { lat: 8.3114, lng: 80.4037 },
  Badulla: { lat: 6.9895, lng: 81.0557 },
  Batticaloa: { lat: 7.7170, lng: 81.7000 },
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Galle: { lat: 6.0535, lng: 80.2210 },
  Gampaha: { lat: 7.0917, lng: 79.9982 },
  Hambantota: { lat: 6.1241, lng: 81.1185 },
  Jaffna: { lat: 9.6615, lng: 80.0255 },
  Kalutara: { lat: 6.5854, lng: 79.9607 },
  Kandy: { lat: 7.2906, lng: 80.6337 },
  Kegalle: { lat: 7.2513, lng: 80.3464 },
  Kilinochchi: { lat: 9.3940, lng: 80.4080 },
  Kurunegala: { lat: 7.4867, lng: 80.3647 },
  Mannar: { lat: 8.9800, lng: 79.9000 },
  Matale: { lat: 7.4675, lng: 80.6234 },
  Matara: { lat: 5.9496, lng: 80.5469 },
  Moneragala: { lat: 6.8714, lng: 81.3487 },
  Monaragala: { lat: 6.8714, lng: 81.3487 },
  Mullaitivu: { lat: 9.2671, lng: 80.8142 },
  NuwaraEliya: { lat: 6.9497, lng: 80.7891 },
  Polonnaruwa: { lat: 7.9397, lng: 81.0000 },
  Puttalam: { lat: 8.0408, lng: 79.8394 },
  Ratnapura: { lat: 6.7056, lng: 80.3847 },
  Trincomalee: { lat: 8.5874, lng: 81.2152 },
  Vavuniya: { lat: 8.7514, lng: 80.4971 },
};

export const DISTRICT_TO_PROVINCE = {
  Colombo: 'Western',
  Gampaha: 'Western',
  Kalutara: 'Western',

  Kandy: 'Central',
  Matale: 'Central',
  NuwaraEliya: 'Central',

  Galle: 'Southern',
  Matara: 'Southern',
  Hambantota: 'Southern',

  Jaffna: 'Northern',
  Kilinochchi: 'Northern',
  Mannar: 'Northern',
  Mullaitivu: 'Northern',
  Vavuniya: 'Northern',

  Trincomalee: 'Eastern',
  Batticaloa: 'Eastern',
  Ampara: 'Eastern',

  Kurunegala: 'North Western',
  Puttalam: 'North Western',

  Anuradhapura: 'North Central',
  Polonnaruwa: 'North Central',

  Badulla: 'Uva',
  Moneragala: 'Uva',
  Monaragala: 'Uva',

  Ratnapura: 'Sabaragamuwa',
  Kegalle: 'Sabaragamuwa',
};

export const PROVINCE_CENTERS = {
  Western: { lat: 6.9275, lng: 79.9340 },
  Central: { lat: 7.2850, lng: 80.6800 },
  Southern: { lat: 6.1150, lng: 80.6200 },
  Northern: { lat: 9.2600, lng: 80.2900 },
  Eastern: { lat: 7.8600, lng: 81.5300 },
  'North Western': { lat: 7.8200, lng: 80.1100 },
  'North Central': { lat: 8.1200, lng: 80.7000 },
  Uva: { lat: 6.9300, lng: 81.0800 },
  Sabaragamuwa: { lat: 6.7750, lng: 80.4300 },
};

export const SRI_LANKA_PROVINCES = Object.keys(PROVINCE_CENTERS);

const DISTRICT_ALIASES = {
  'nuwara eliya': 'NuwaraEliya',
  'nuwara-eliya': 'NuwaraEliya',
  monaragala: 'Monaragala',
  moneragala: 'Moneragala',
  vanni: 'Vavuniya',
};

export function normalizeDistrictName(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  const cleaned = s.replace(/\s+/g, ' ').toLowerCase();
  if (DISTRICT_ALIASES[cleaned]) return DISTRICT_ALIASES[cleaned];

  // Title-case and strip spaces for matching keys like "NuwaraEliya"
  const title = cleaned.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/[^A-Za-z]/g, '');
  if (DISTRICT_COORDS[title]) return title;

  // Try direct title-case with spaces (rare)
  const spacedTitle = cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
  if (DISTRICT_COORDS[spacedTitle]) return spacedTitle;

  // fallback: return original trimmed
  return s;
}

export function getProvinceFromDistrict(rawDistrict) {
  const normalized = normalizeDistrictName(rawDistrict);
  return DISTRICT_TO_PROVINCE[normalized] || 'Unknown';
}

