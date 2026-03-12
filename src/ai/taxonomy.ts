import type { ServiceTaxonomy } from './types';

export const SERVICE_TAXONOMY: ServiceTaxonomy[] = [
  {
    industry: 'Home Services',
    serviceCategory: 'Plumbing',
    subServices: ['Drain cleaning', 'Pipe repair', 'Emergency plumbing', 'Water heater installation', 'Leak detection'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Electrical',
    subServices: ['Wiring', 'Panel upgrade', 'Lighting installation', 'Emergency electrician', 'EV charger install'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'HVAC',
    subServices: ['AC repair', 'Heating installation', 'Duct cleaning', 'Thermostat setup', 'Emergency HVAC'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Cleaning',
    subServices: ['House cleaning', 'Office cleaning', 'Deep cleaning', 'Move-out cleaning', 'Window cleaning'],
  },
  {
    industry: 'Home Services',
    serviceCategory: 'Roofing',
    subServices: ['Roof repair', 'Roof replacement', 'Gutter installation', 'Roof inspection', 'Storm damage repair'],
  },
  {
    industry: 'Health & Wellness',
    serviceCategory: 'Dental',
    subServices: ['Teeth cleaning', 'Implants', 'Orthodontics', 'Emergency dental', 'Cosmetic dentistry'],
  },
  {
    industry: 'Health & Wellness',
    serviceCategory: 'Physiotherapy',
    subServices: ['Sports rehab', 'Post-surgery rehab', 'Massage therapy', 'Pain management', 'Mobility training'],
  },
  {
    industry: 'Professional Services',
    serviceCategory: 'Legal',
    subServices: ['Family law', 'Criminal defense', 'Business law', 'Immigration', 'Real estate law'],
  },
  {
    industry: 'Professional Services',
    serviceCategory: 'Accounting',
    subServices: ['Tax preparation', 'Bookkeeping', 'Payroll services', 'Financial planning', 'Audit'],
  },
  {
    industry: 'Automotive',
    serviceCategory: 'Auto Repair',
    subServices: ['Oil change', 'Brake repair', 'Engine diagnostics', 'Tire service', 'Collision repair'],
  },
  {
    industry: 'Beauty & Personal Care',
    serviceCategory: 'Hair Salon',
    subServices: ['Haircut', 'Coloring', 'Styling', 'Keratin treatment', 'Extensions'],
  },
  {
    industry: 'Beauty & Personal Care',
    serviceCategory: 'Spa',
    subServices: ['Facial treatment', 'Body massage', 'Manicure & pedicure', 'Waxing', 'Aromatherapy'],
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
