import type { ServiceTaxonomy } from './types';

export const SERVICE_TAXONOMY: ServiceTaxonomy[] = [
  // ── Home Services ──────────────────────────────
  {
    industry: 'Home Services',
    serviceCategory: 'Plumbing',
    subServices: ['Drain cleaning', 'Pipe repair', 'Emergency plumbing', 'Water heater installation', 'Leak detection', 'Sewer line repair'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Electrical',
    subServices: ['Wiring', 'Panel upgrade', 'Lighting installation', 'Emergency electrician', 'EV charger install', 'Smart home wiring'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'HVAC',
    subServices: ['AC repair', 'Heating installation', 'Duct cleaning', 'Thermostat setup', 'Emergency HVAC', 'Heat pump install'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Cleaning',
    subServices: ['House cleaning', 'Office cleaning', 'Deep cleaning', 'Move-out cleaning', 'Window cleaning', 'Carpet cleaning'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Roofing',
    subServices: ['Roof repair', 'Roof replacement', 'Gutter installation', 'Roof inspection', 'Storm damage repair', 'Metal roofing'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Landscaping',
    subServices: ['Lawn care', 'Garden design', 'Tree trimming', 'Irrigation systems', 'Hardscaping', 'Snow removal'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Pest Control',
    subServices: ['Termite treatment', 'Rodent control', 'Bed bug removal', 'Mosquito control', 'Wildlife removal', 'Preventive treatment'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Painting',
    subServices: ['Interior painting', 'Exterior painting', 'Cabinet refinishing', 'Deck staining', 'Wallpaper removal', 'Commercial painting'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Flooring',
    subServices: ['Hardwood installation', 'Tile installation', 'Carpet installation', 'Laminate flooring', 'Floor refinishing', 'Epoxy flooring'],
  },

  // ── Health & Wellness ──────────────────────────
  {
    industry: 'Health & Wellness',
    serviceCategory: 'Dental',
    subServices: ['Teeth cleaning', 'Implants', 'Orthodontics', 'Emergency dental', 'Cosmetic dentistry', 'Teeth whitening'],
  },
  {
    industry: 'Health & Wellness',
    serviceCategory: 'Physiotherapy',
    subServices: ['Sports rehab', 'Post-surgery rehab', 'Massage therapy', 'Pain management', 'Mobility training', 'Dry needling'],
  },
  {
    industry: 'Health & Wellness',
    serviceCategory: 'Chiropractic',
    subServices: ['Spinal adjustment', 'Posture correction', 'Sports chiropractic', 'Prenatal care', 'Pediatric chiropractic', 'Sciatica treatment'],
  },
  {
    industry: 'Health & Wellness',
    serviceCategory: 'Mental Health',
    subServices: ['Individual therapy', 'Couples counseling', 'Anxiety treatment', 'Depression therapy', 'EMDR therapy', 'Group therapy'],
  },
  {
    industry: 'Health & Wellness',
    serviceCategory: 'Veterinary',
    subServices: ['Wellness exams', 'Vaccinations', 'Surgery', 'Dental care', 'Emergency vet', 'Pet grooming'],
  },

  // ── Professional Services ──────────────────────
  {
    industry: 'Professional Services',
    serviceCategory: 'Legal',
    subServices: ['Family law', 'Criminal defense', 'Business law', 'Immigration', 'Real estate law', 'Personal injury'],
  },
  {
    industry: 'Professional Services',
    serviceCategory: 'Accounting',
    subServices: ['Tax preparation', 'Bookkeeping', 'Payroll services', 'Financial planning', 'Audit', 'Business consulting'],
  },
  {
    industry: 'Professional Services',
    serviceCategory: 'IT Services',
    subServices: ['Network setup', 'Cybersecurity', 'Cloud migration', 'Managed IT', 'Data recovery', 'VoIP setup'],
  },
  {
    industry: 'Professional Services',
    serviceCategory: 'Marketing Agency',
    subServices: ['SEO', 'PPC advertising', 'Social media management', 'Content marketing', 'Brand design', 'Email marketing'],
  },
  {
    industry: 'Professional Services',
    serviceCategory: 'Real Estate',
    subServices: ['Buying agent', 'Selling agent', 'Property management', 'Commercial real estate', 'Rental services', 'Home staging'],
  },

  // ── Automotive ─────────────────────────────────
  {
    industry: 'Automotive',
    serviceCategory: 'Auto Repair',
    subServices: ['Oil change', 'Brake repair', 'Engine diagnostics', 'Tire service', 'Collision repair', 'Transmission repair'],
  },
  {
    industry: 'Automotive',
    serviceCategory: 'Auto Detailing',
    subServices: ['Exterior wash', 'Interior detailing', 'Paint correction', 'Ceramic coating', 'Window tinting', 'Upholstery cleaning'],
  },
  {
    industry: 'Automotive',
    serviceCategory: 'Towing',
    subServices: ['Emergency towing', 'Flatbed towing', 'Motorcycle towing', 'Long-distance towing', 'Roadside assistance', 'Lockout service'],
  },

  // ── Beauty & Personal Care ─────────────────────
  {
    industry: 'Beauty & Personal Care',
    serviceCategory: 'Hair Salon',
    subServices: ['Haircut', 'Coloring', 'Styling', 'Keratin treatment', 'Extensions', 'Balayage'],
  },
  {
    industry: 'Beauty & Personal Care',
    serviceCategory: 'Spa',
    subServices: ['Facial treatment', 'Body massage', 'Manicure & pedicure', 'Waxing', 'Aromatherapy', 'Hot stone massage'],
  },
  {
    industry: 'Beauty & Personal Care',
    serviceCategory: 'Barbershop',
    subServices: ['Men\'s haircut', 'Beard trim', 'Hot towel shave', 'Hair coloring', 'Scalp treatment', 'Kids haircut'],
  },
  {
    industry: 'Beauty & Personal Care',
    serviceCategory: 'Tattoo & Piercing',
    subServices: ['Custom tattoo', 'Cover-up tattoo', 'Body piercing', 'Ear piercing', 'Tattoo removal', 'Flash tattoo'],
  },

  // ── Food & Hospitality ─────────────────────────
  {
    industry: 'Food & Hospitality',
    serviceCategory: 'Catering',
    subServices: ['Wedding catering', 'Corporate events', 'Private parties', 'Buffet service', 'BBQ catering', 'Meal prep delivery'],
  },
  {
    industry: 'Food & Hospitality',
    serviceCategory: 'Restaurant',
    subServices: ['Dine-in', 'Takeout', 'Delivery', 'Private dining', 'Brunch menu', 'Catering events'],
  },
  {
    industry: 'Food & Hospitality',
    serviceCategory: 'Bakery',
    subServices: ['Custom cakes', 'Wedding cakes', 'Pastries', 'Bread', 'Gluten-free options', 'Wholesale supply'],
  },

  // ── Education & Training ───────────────────────
  {
    industry: 'Education & Training',
    serviceCategory: 'Tutoring',
    subServices: ['Math tutoring', 'Science tutoring', 'SAT/ACT prep', 'Language lessons', 'Online tutoring', 'Homework help'],
  },
  {
    industry: 'Education & Training',
    serviceCategory: 'Music School',
    subServices: ['Piano lessons', 'Guitar lessons', 'Voice lessons', 'Drum lessons', 'Music theory', 'Group classes'],
  },
  {
    industry: 'Education & Training',
    serviceCategory: 'Driving School',
    subServices: ['Beginner lessons', 'Defensive driving', 'Road test prep', 'Commercial license', 'Refresher course', 'Online theory'],
  },

  // ── Fitness & Sports ───────────────────────────
  {
    industry: 'Fitness & Sports',
    serviceCategory: 'Personal Training',
    subServices: ['Weight loss', 'Strength training', 'HIIT', 'Online coaching', 'Nutrition planning', 'Group fitness'],
  },
  {
    industry: 'Fitness & Sports',
    serviceCategory: 'Yoga Studio',
    subServices: ['Hatha yoga', 'Vinyasa yoga', 'Hot yoga', 'Prenatal yoga', 'Private sessions', 'Meditation classes'],
  },
  {
    industry: 'Fitness & Sports',
    serviceCategory: 'Martial Arts',
    subServices: ['Karate', 'Brazilian Jiu-Jitsu', 'Muay Thai', 'Boxing', 'Kids classes', 'Self-defense'],
  },
];

export function getIndustries(): string[] {
  return [...new Set(SERVICE_TAXONOMY.map((t) => t.industry))];
}

export function getCategoriesByIndustry(industry: string): string[] {
  return SERVICE_TAXONOMY.filter((t) => t.industry === industry).map((t) => t.serviceCategory);
}

export function getSubServices(industry: string, category: string): string[] {
  const entry = SERVICE_TAXONOMY.find((t) => t.industry === industry && t.serviceCategory === category);
  return entry?.subServices ?? [];
}
