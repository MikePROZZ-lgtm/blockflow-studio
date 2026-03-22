/**
 * Geo Database: country → city → districts
 * Used for programmatic SEO page generation.
 */

export interface District {
  name: string;
  slug: string;
}

export interface City {
  name: string;
  slug: string;
  population?: number;
  seoVariations: string[];
  districts: District[];
}

export interface Country {
  name: string;
  slug: string;
  cities: City[];
}

export const GEO_DATABASE: Country[] = [
  {
    name: 'Germany',
    slug: 'germany',
    cities: [
      {
        name: 'Berlin',
        slug: 'berlin',
        population: 3_645_000,
        seoVariations: ['Berlin', 'Berlin Germany', 'Berlin DE'],
        districts: [
          { name: 'Mitte', slug: 'mitte' },
          { name: 'Kreuzberg', slug: 'kreuzberg' },
          { name: 'Prenzlauer Berg', slug: 'prenzlauer-berg' },
          { name: 'Charlottenburg', slug: 'charlottenburg' },
          { name: 'Neukölln', slug: 'neukoelln' },
          { name: 'Friedrichshain', slug: 'friedrichshain' },
          { name: 'Schöneberg', slug: 'schoeneberg' },
          { name: 'Tempelhof', slug: 'tempelhof' },
          { name: 'Steglitz', slug: 'steglitz' },
          { name: 'Wedding', slug: 'wedding' },
        ],
      },
      {
        name: 'Munich',
        slug: 'munich',
        population: 1_472_000,
        seoVariations: ['Munich', 'München', 'Munich Germany'],
        districts: [
          { name: 'Altstadt', slug: 'altstadt' },
          { name: 'Schwabing', slug: 'schwabing' },
          { name: 'Maxvorstadt', slug: 'maxvorstadt' },
          { name: 'Haidhausen', slug: 'haidhausen' },
          { name: 'Sendling', slug: 'sendling' },
        ],
      },
      {
        name: 'Hamburg',
        slug: 'hamburg',
        population: 1_841_000,
        seoVariations: ['Hamburg', 'Hamburg Germany'],
        districts: [
          { name: 'Altona', slug: 'altona' },
          { name: 'Eimsbüttel', slug: 'eimsbuettel' },
          { name: 'Hamburg-Mitte', slug: 'hamburg-mitte' },
          { name: 'Wandsbek', slug: 'wandsbek' },
          { name: 'Harburg', slug: 'harburg' },
        ],
      },
      {
        name: 'Frankfurt',
        slug: 'frankfurt',
        population: 753_000,
        seoVariations: ['Frankfurt', 'Frankfurt am Main', 'Frankfurt Germany'],
        districts: [
          { name: 'Sachsenhausen', slug: 'sachsenhausen' },
          { name: 'Nordend', slug: 'nordend' },
          { name: 'Bornheim', slug: 'bornheim' },
          { name: 'Bockenheim', slug: 'bockenheim' },
        ],
      },
      {
        name: 'Cologne',
        slug: 'cologne',
        population: 1_086_000,
        seoVariations: ['Cologne', 'Köln', 'Cologne Germany'],
        districts: [
          { name: 'Ehrenfeld', slug: 'ehrenfeld' },
          { name: 'Nippes', slug: 'nippes' },
          { name: 'Deutz', slug: 'deutz' },
          { name: 'Sülz', slug: 'suelz' },
        ],
      },
    ],
  },
  {
    name: 'United States',
    slug: 'united-states',
    cities: [
      {
        name: 'New York',
        slug: 'new-york',
        population: 8_336_000,
        seoVariations: ['New York', 'NYC', 'New York City'],
        districts: [
          { name: 'Manhattan', slug: 'manhattan' },
          { name: 'Brooklyn', slug: 'brooklyn' },
          { name: 'Queens', slug: 'queens' },
          { name: 'Bronx', slug: 'bronx' },
          { name: 'Staten Island', slug: 'staten-island' },
        ],
      },
      {
        name: 'Los Angeles',
        slug: 'los-angeles',
        population: 3_979_000,
        seoVariations: ['Los Angeles', 'LA', 'Los Angeles CA'],
        districts: [
          { name: 'Hollywood', slug: 'hollywood' },
          { name: 'Santa Monica', slug: 'santa-monica' },
          { name: 'Downtown LA', slug: 'downtown-la' },
          { name: 'Beverly Hills', slug: 'beverly-hills' },
        ],
      },
      {
        name: 'Chicago',
        slug: 'chicago',
        population: 2_693_000,
        seoVariations: ['Chicago', 'Chicago IL'],
        districts: [
          { name: 'Lincoln Park', slug: 'lincoln-park' },
          { name: 'Wicker Park', slug: 'wicker-park' },
          { name: 'Loop', slug: 'loop' },
          { name: 'Hyde Park', slug: 'hyde-park' },
        ],
      },
    ],
  },
  {
    name: 'United Kingdom',
    slug: 'united-kingdom',
    cities: [
      {
        name: 'London',
        slug: 'london',
        population: 8_982_000,
        seoVariations: ['London', 'London UK', 'Greater London'],
        districts: [
          { name: 'Westminster', slug: 'westminster' },
          { name: 'Camden', slug: 'camden' },
          { name: 'Islington', slug: 'islington' },
          { name: 'Shoreditch', slug: 'shoreditch' },
          { name: 'Greenwich', slug: 'greenwich' },
        ],
      },
      {
        name: 'Manchester',
        slug: 'manchester',
        population: 553_000,
        seoVariations: ['Manchester', 'Manchester UK'],
        districts: [
          { name: 'Northern Quarter', slug: 'northern-quarter' },
          { name: 'Didsbury', slug: 'didsbury' },
          { name: 'Chorlton', slug: 'chorlton' },
        ],
      },
    ],
  },
];

// ── Query Helpers ──────────────────────────────

export function getCountries(): Country[] {
  return GEO_DATABASE;
}

export function getCountryBySlug(slug: string): Country | undefined {
  return GEO_DATABASE.find((c) => c.slug === slug);
}

export function getCitiesByCountry(countrySlug: string): City[] {
  return getCountryBySlug(countrySlug)?.cities ?? [];
}

export function getCityBySlug(countrySlug: string, citySlug: string): City | undefined {
  return getCitiesByCountry(countrySlug).find((c) => c.slug === citySlug);
}

export function getAllCities(): City[] {
  return GEO_DATABASE.flatMap((c) => c.cities);
}

export function getDistrictsByCity(countrySlug: string, citySlug: string): District[] {
  return getCityBySlug(countrySlug, citySlug)?.districts ?? [];
}
