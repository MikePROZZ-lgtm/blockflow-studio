/**
 * Enhanced Service Taxonomy with keywords, intent, and CTA patterns.
 * Structure: industry → category → service → sub-service
 */

export interface SubService {
  name: string;
  slug: string;
  keywords: string[];
}

export interface ServiceEntry {
  name: string;
  slug: string;
  keywords: string[];
  commonPhrases: string[];
  userIntents: string[];
  ctaPatterns: string[];
  subServices: SubService[];
}

export interface CategoryEntry {
  name: string;
  slug: string;
  services: ServiceEntry[];
}

export interface IndustryEntry {
  name: string;
  slug: string;
  categories: CategoryEntry[];
}

export const SERVICE_TAXONOMY: IndustryEntry[] = [
  {
    name: 'Home Services',
    slug: 'home-services',
    categories: [
      {
        name: 'Plumbing',
        slug: 'plumbing',
        services: [
          {
            name: 'Drain Cleaning',
            slug: 'drain-cleaning',
            keywords: ['drain cleaning', 'clogged drain', 'drain unclogging', 'blocked drain', 'drain repair'],
            commonPhrases: ['clogged kitchen sink', 'slow draining bathtub', 'blocked sewer line'],
            userIntents: ['emergency', 'routine', 'preventive'],
            ctaPatterns: ['Get Your Drains Cleared Today', 'Book Drain Cleaning Now', 'Free Drain Inspection'],
            subServices: [
              { name: 'Kitchen Drain Cleaning', slug: 'kitchen-drain-cleaning', keywords: ['kitchen drain', 'kitchen sink clog'] },
              { name: 'Bathroom Drain Cleaning', slug: 'bathroom-drain-cleaning', keywords: ['bathroom drain', 'shower drain clog'] },
              { name: 'Sewer Line Cleaning', slug: 'sewer-line-cleaning', keywords: ['sewer line', 'main sewer', 'sewer backup'] },
            ],
          },
          {
            name: 'Pipe Repair',
            slug: 'pipe-repair',
            keywords: ['pipe repair', 'broken pipe', 'leaking pipe', 'pipe replacement', 'burst pipe'],
            commonPhrases: ['water leaking from pipe', 'frozen pipes', 'pipe burst in basement'],
            userIntents: ['emergency', 'repair', 'replacement'],
            ctaPatterns: ['Fix Your Pipes Today', 'Emergency Pipe Repair', '24/7 Pipe Service'],
            subServices: [
              { name: 'Water Pipe Repair', slug: 'water-pipe-repair', keywords: ['water pipe', 'water line repair'] },
              { name: 'Gas Pipe Repair', slug: 'gas-pipe-repair', keywords: ['gas pipe', 'gas line repair', 'gas leak'] },
              { name: 'Sewer Pipe Repair', slug: 'sewer-pipe-repair', keywords: ['sewer pipe', 'sewer line repair'] },
            ],
          },
          {
            name: 'Emergency Plumbing',
            slug: 'emergency-plumbing',
            keywords: ['emergency plumber', '24/7 plumber', 'urgent plumbing', 'plumbing emergency'],
            commonPhrases: ['plumber near me now', 'emergency plumber tonight', 'weekend plumber'],
            userIntents: ['emergency', 'urgent', 'after-hours'],
            ctaPatterns: ['Call Now — 30 Min Response', '24/7 Emergency Plumber', 'We Come to You Fast'],
            subServices: [
              { name: 'Flood Cleanup', slug: 'flood-cleanup', keywords: ['flood', 'water damage', 'flooding'] },
              { name: 'Burst Pipe Emergency', slug: 'burst-pipe-emergency', keywords: ['burst pipe', 'pipe burst', 'pipe explosion'] },
            ],
          },
          {
            name: 'Water Heater',
            slug: 'water-heater',
            keywords: ['water heater', 'hot water', 'boiler repair', 'tankless water heater'],
            commonPhrases: ['no hot water', 'water heater leaking', 'water heater installation'],
            userIntents: ['repair', 'installation', 'replacement'],
            ctaPatterns: ['Restore Your Hot Water', 'Water Heater Installation', 'Same-Day Water Heater Repair'],
            subServices: [
              { name: 'Water Heater Installation', slug: 'water-heater-installation', keywords: ['install water heater', 'new water heater'] },
              { name: 'Water Heater Repair', slug: 'water-heater-repair', keywords: ['fix water heater', 'water heater not working'] },
              { name: 'Tankless Water Heater', slug: 'tankless-water-heater', keywords: ['tankless', 'on-demand hot water'] },
            ],
          },
        ],
      },
      {
        name: 'Electrical',
        slug: 'electrical',
        services: [
          {
            name: 'Electrical Repair',
            slug: 'electrical-repair',
            keywords: ['electrical repair', 'electrician', 'electrical fix', 'wiring repair'],
            commonPhrases: ['outlet not working', 'flickering lights', 'tripping breaker'],
            userIntents: ['repair', 'emergency', 'inspection'],
            ctaPatterns: ['Safe Electrical Repairs', 'Licensed Electrician Near You', 'Book an Electrician'],
            subServices: [
              { name: 'Outlet Repair', slug: 'outlet-repair', keywords: ['outlet', 'socket', 'plug repair'] },
              { name: 'Circuit Breaker Repair', slug: 'circuit-breaker-repair', keywords: ['circuit breaker', 'breaker box', 'fuse box'] },
              { name: 'Wiring Repair', slug: 'wiring-repair', keywords: ['wiring', 'rewiring', 'electrical wiring'] },
            ],
          },
          {
            name: 'Lighting Installation',
            slug: 'lighting-installation',
            keywords: ['lighting', 'light installation', 'LED lighting', 'recessed lighting'],
            commonPhrases: ['install new lights', 'upgrade lighting', 'outdoor lighting'],
            userIntents: ['installation', 'upgrade', 'design'],
            ctaPatterns: ['Light Up Your Home', 'Professional Lighting Installation', 'Free Lighting Consultation'],
            subServices: [
              { name: 'Indoor Lighting', slug: 'indoor-lighting', keywords: ['indoor lights', 'ceiling lights', 'recessed'] },
              { name: 'Outdoor Lighting', slug: 'outdoor-lighting', keywords: ['outdoor lights', 'landscape lighting', 'security lights'] },
            ],
          },
        ],
      },
      {
        name: 'HVAC',
        slug: 'hvac',
        services: [
          {
            name: 'AC Repair',
            slug: 'ac-repair',
            keywords: ['AC repair', 'air conditioning repair', 'AC not cooling', 'AC service'],
            commonPhrases: ['AC broken', 'air conditioner not working', 'AC blowing warm air'],
            userIntents: ['repair', 'emergency', 'maintenance'],
            ctaPatterns: ['Cool Down Fast', 'AC Repair Today', 'Same-Day AC Service'],
            subServices: [
              { name: 'Central AC Repair', slug: 'central-ac-repair', keywords: ['central AC', 'central air'] },
              { name: 'AC Installation', slug: 'ac-installation', keywords: ['AC install', 'new AC unit'] },
              { name: 'AC Maintenance', slug: 'ac-maintenance', keywords: ['AC tune-up', 'AC check-up'] },
            ],
          },
          {
            name: 'Heating Repair',
            slug: 'heating-repair',
            keywords: ['heating repair', 'furnace repair', 'heater not working', 'heating service'],
            commonPhrases: ['furnace broken', 'no heat', 'heater blowing cold air'],
            userIntents: ['repair', 'emergency', 'installation'],
            ctaPatterns: ['Stay Warm — Call Now', 'Heating Repair Today', 'Furnace Service'],
            subServices: [
              { name: 'Furnace Repair', slug: 'furnace-repair', keywords: ['furnace', 'furnace fix'] },
              { name: 'Boiler Repair', slug: 'boiler-repair', keywords: ['boiler', 'boiler service'] },
              { name: 'Heat Pump Repair', slug: 'heat-pump-repair', keywords: ['heat pump', 'heat pump service'] },
            ],
          },
        ],
      },
      {
        name: 'Cleaning',
        slug: 'cleaning',
        services: [
          {
            name: 'House Cleaning',
            slug: 'house-cleaning',
            keywords: ['house cleaning', 'home cleaning', 'maid service', 'cleaning service'],
            commonPhrases: ['clean my house', 'weekly cleaning', 'deep clean'],
            userIntents: ['recurring', 'one-time', 'deep-clean'],
            ctaPatterns: ['Book a Cleaning Today', 'Sparkling Clean Home', 'Free Cleaning Estimate'],
            subServices: [
              { name: 'Deep Cleaning', slug: 'deep-cleaning', keywords: ['deep clean', 'thorough cleaning'] },
              { name: 'Move-In/Out Cleaning', slug: 'move-in-out-cleaning', keywords: ['move-in cleaning', 'move-out cleaning'] },
              { name: 'Regular Cleaning', slug: 'regular-cleaning', keywords: ['weekly cleaning', 'bi-weekly cleaning'] },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    categories: [
      {
        name: 'Dental',
        slug: 'dental',
        services: [
          {
            name: 'General Dentistry',
            slug: 'general-dentistry',
            keywords: ['dentist', 'dental checkup', 'teeth cleaning', 'dental exam'],
            commonPhrases: ['dentist near me', 'dental cleaning', 'tooth pain'],
            userIntents: ['checkup', 'emergency', 'cosmetic'],
            ctaPatterns: ['Book Your Dental Checkup', 'Smile with Confidence', 'Free Dental Consultation'],
            subServices: [
              { name: 'Teeth Cleaning', slug: 'teeth-cleaning', keywords: ['teeth cleaning', 'dental cleaning', 'hygiene'] },
              { name: 'Tooth Filling', slug: 'tooth-filling', keywords: ['filling', 'cavity', 'tooth repair'] },
              { name: 'Root Canal', slug: 'root-canal', keywords: ['root canal', 'endodontic', 'tooth infection'] },
            ],
          },
          {
            name: 'Cosmetic Dentistry',
            slug: 'cosmetic-dentistry',
            keywords: ['cosmetic dentist', 'teeth whitening', 'veneers', 'smile makeover'],
            commonPhrases: ['whiten my teeth', 'fix my smile', 'dental veneers'],
            userIntents: ['cosmetic', 'enhancement', 'consultation'],
            ctaPatterns: ['Transform Your Smile', 'Book a Smile Consultation', 'Teeth Whitening Special'],
            subServices: [
              { name: 'Teeth Whitening', slug: 'teeth-whitening', keywords: ['whitening', 'bleaching', 'white teeth'] },
              { name: 'Dental Veneers', slug: 'dental-veneers', keywords: ['veneers', 'porcelain veneers'] },
              { name: 'Dental Implants', slug: 'dental-implants', keywords: ['implants', 'dental implant', 'tooth replacement'] },
            ],
          },
        ],
      },
      {
        name: 'Physiotherapy',
        slug: 'physiotherapy',
        services: [
          {
            name: 'Sports Physiotherapy',
            slug: 'sports-physiotherapy',
            keywords: ['sports physio', 'sports injury', 'athletic rehabilitation'],
            commonPhrases: ['injured during sport', 'sports recovery', 'athlete rehab'],
            userIntents: ['recovery', 'prevention', 'performance'],
            ctaPatterns: ['Get Back in the Game', 'Sports Injury Recovery', 'Book a Sports Physio Session'],
            subServices: [
              { name: 'Injury Rehabilitation', slug: 'injury-rehabilitation', keywords: ['rehab', 'recovery', 'injury recovery'] },
              { name: 'Performance Training', slug: 'performance-training', keywords: ['performance', 'athletic training'] },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Professional Services',
    slug: 'professional-services',
    categories: [
      {
        name: 'Legal',
        slug: 'legal',
        services: [
          {
            name: 'Family Law',
            slug: 'family-law',
            keywords: ['family lawyer', 'divorce attorney', 'custody lawyer', 'family law'],
            commonPhrases: ['need a divorce lawyer', 'child custody help', 'family court'],
            userIntents: ['consultation', 'representation', 'mediation'],
            ctaPatterns: ['Free Legal Consultation', 'Protect Your Family', 'Speak to a Lawyer Today'],
            subServices: [
              { name: 'Divorce', slug: 'divorce', keywords: ['divorce', 'separation', 'divorce attorney'] },
              { name: 'Child Custody', slug: 'child-custody', keywords: ['custody', 'child support', 'parenting plan'] },
            ],
          },
        ],
      },
      {
        name: 'Accounting',
        slug: 'accounting',
        services: [
          {
            name: 'Tax Services',
            slug: 'tax-services',
            keywords: ['tax preparation', 'tax filing', 'accountant', 'CPA'],
            commonPhrases: ['file my taxes', 'need an accountant', 'tax help'],
            userIntents: ['filing', 'planning', 'audit'],
            ctaPatterns: ['File Your Taxes Stress-Free', 'Expert Tax Preparation', 'Book a Tax Consultation'],
            subServices: [
              { name: 'Personal Tax Filing', slug: 'personal-tax-filing', keywords: ['personal tax', 'individual tax'] },
              { name: 'Business Tax Filing', slug: 'business-tax-filing', keywords: ['business tax', 'corporate tax'] },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    categories: [
      {
        name: 'Auto Repair',
        slug: 'auto-repair',
        services: [
          {
            name: 'Brake Service',
            slug: 'brake-service',
            keywords: ['brake repair', 'brake pads', 'brake service', 'brakes squeaking'],
            commonPhrases: ['brakes making noise', 'need new brakes', 'brake inspection'],
            userIntents: ['repair', 'inspection', 'replacement'],
            ctaPatterns: ['Stop Safely — Book Brake Service', 'Free Brake Inspection', 'Expert Brake Repair'],
            subServices: [
              { name: 'Brake Pad Replacement', slug: 'brake-pad-replacement', keywords: ['brake pads', 'pad replacement'] },
              { name: 'Brake Rotor Service', slug: 'brake-rotor-service', keywords: ['brake rotor', 'rotor resurfacing'] },
            ],
          },
          {
            name: 'Oil Change',
            slug: 'oil-change',
            keywords: ['oil change', 'oil service', 'motor oil', 'synthetic oil'],
            commonPhrases: ['need an oil change', 'oil change near me', 'quick oil change'],
            userIntents: ['maintenance', 'quick-service'],
            ctaPatterns: ['Quick Oil Change', 'Book Your Oil Change', '$29.99 Oil Change Special'],
            subServices: [
              { name: 'Synthetic Oil Change', slug: 'synthetic-oil-change', keywords: ['synthetic oil', 'full synthetic'] },
              { name: 'Conventional Oil Change', slug: 'conventional-oil-change', keywords: ['conventional oil', 'regular oil'] },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    categories: [
      {
        name: 'Hair Salon',
        slug: 'hair-salon',
        services: [
          {
            name: 'Haircut',
            slug: 'haircut',
            keywords: ['haircut', 'hair cut', 'hair styling', 'barber'],
            commonPhrases: ['need a haircut', 'hair salon near me', 'best haircut'],
            userIntents: ['styling', 'regular', 'special-occasion'],
            ctaPatterns: ['Book Your Haircut', 'New Look Awaits', 'Walk-Ins Welcome'],
            subServices: [
              { name: "Women's Haircut", slug: 'womens-haircut', keywords: ["women's haircut", 'ladies haircut'] },
              { name: "Men's Haircut", slug: 'mens-haircut', keywords: ["men's haircut", 'gentleman haircut'] },
              { name: "Children's Haircut", slug: 'childrens-haircut', keywords: ["kids haircut", "children's haircut"] },
            ],
          },
          {
            name: 'Hair Coloring',
            slug: 'hair-coloring',
            keywords: ['hair color', 'hair dye', 'highlights', 'balayage'],
            commonPhrases: ['color my hair', 'highlights near me', 'balayage specialist'],
            userIntents: ['transformation', 'touch-up', 'consultation'],
            ctaPatterns: ['Transform Your Color', 'Book Hair Coloring', 'Free Color Consultation'],
            subServices: [
              { name: 'Highlights', slug: 'highlights', keywords: ['highlights', 'foils', 'partial highlights'] },
              { name: 'Balayage', slug: 'balayage', keywords: ['balayage', 'ombre', 'hand-painted highlights'] },
              { name: 'Full Color', slug: 'full-color', keywords: ['full color', 'all-over color', 'single process'] },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Food & Hospitality',
    slug: 'food-hospitality',
    categories: [
      {
        name: 'Catering',
        slug: 'catering',
        services: [
          {
            name: 'Event Catering',
            slug: 'event-catering',
            keywords: ['catering', 'event catering', 'party catering', 'catering service'],
            commonPhrases: ['catering for wedding', 'corporate event food', 'party food delivery'],
            userIntents: ['event', 'corporate', 'private'],
            ctaPatterns: ['Cater Your Event', 'Get a Catering Quote', 'Delicious Food for Any Event'],
            subServices: [
              { name: 'Wedding Catering', slug: 'wedding-catering', keywords: ['wedding food', 'wedding caterer'] },
              { name: 'Corporate Catering', slug: 'corporate-catering', keywords: ['corporate food', 'office catering', 'business lunch'] },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Education & Training',
    slug: 'education-training',
    categories: [
      {
        name: 'Tutoring',
        slug: 'tutoring',
        services: [
          {
            name: 'Math Tutoring',
            slug: 'math-tutoring',
            keywords: ['math tutor', 'math help', 'math tutoring', 'algebra tutor'],
            commonPhrases: ['need a math tutor', 'help with algebra', 'math homework help'],
            userIntents: ['regular', 'exam-prep', 'catch-up'],
            ctaPatterns: ['Ace Your Math Class', 'Expert Math Tutoring', 'Book a Free Trial Lesson'],
            subServices: [
              { name: 'Algebra Tutoring', slug: 'algebra-tutoring', keywords: ['algebra', 'algebra help'] },
              { name: 'Calculus Tutoring', slug: 'calculus-tutoring', keywords: ['calculus', 'calculus help'] },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Fitness & Sports',
    slug: 'fitness-sports',
    categories: [
      {
        name: 'Personal Training',
        slug: 'personal-training',
        services: [
          {
            name: 'Weight Loss Training',
            slug: 'weight-loss-training',
            keywords: ['weight loss', 'fat loss', 'personal trainer', 'fitness coaching'],
            commonPhrases: ['lose weight', 'personal trainer near me', 'weight loss program'],
            userIntents: ['weight-loss', 'fitness', 'coaching'],
            ctaPatterns: ['Start Your Transformation', 'Free Fitness Assessment', 'Book a Training Session'],
            subServices: [
              { name: 'One-on-One Training', slug: 'one-on-one-training', keywords: ['personal training', '1-on-1 training'] },
              { name: 'Group Fitness', slug: 'group-fitness', keywords: ['group training', 'group workout', 'boot camp'] },
            ],
          },
        ],
      },
    ],
  },
];

// ── Query helpers ──────────────────────────────

export function getIndustries(): IndustryEntry[] {
  return SERVICE_TAXONOMY;
}

export function getIndustryBySlug(slug: string): IndustryEntry | undefined {
  return SERVICE_TAXONOMY.find((i) => i.slug === slug);
}

export function getCategoriesByIndustry(industrySlug: string): CategoryEntry[] {
  return getIndustryBySlug(industrySlug)?.categories ?? [];
}

export function getServicesByCategory(industrySlug: string, categorySlug: string): ServiceEntry[] {
  const cat = getCategoriesByIndustry(industrySlug).find((c) => c.slug === categorySlug);
  return cat?.services ?? [];
}

export function getSubServicesByService(industrySlug: string, categorySlug: string, serviceSlug: string): SubService[] {
  const svc = getServicesByCategory(industrySlug, categorySlug).find((s) => s.slug === serviceSlug);
  return svc?.subServices ?? [];
}

export function getAllKeywordsForService(service: ServiceEntry): string[] {
  const sub = service.subServices.flatMap((s) => s.keywords);
  return [...new Set([...service.keywords, ...sub])];
}

/** Flat list of all service entries across the taxonomy */
export function getAllServices(): (ServiceEntry & { industry: string; category: string })[] {
  return SERVICE_TAXONOMY.flatMap((ind) =>
    ind.categories.flatMap((cat) =>
      cat.services.map((svc) => ({
        ...svc,
        industry: ind.name,
        category: cat.name,
      }))
    )
  );
}
