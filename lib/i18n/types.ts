export type Locale = 'en' | 'es' | 'fr';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'es', 'fr'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'luxe-locale';

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string; nativeName: string }> = {
  en: { label: 'English', flag: '🇺🇸', nativeName: 'English' },
  es: { label: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  fr: { label: 'French', flag: '🇫🇷', nativeName: 'Français' },
};

/**
 * Master translation shape.
 * Add new keys here when adding new translatable strings.
 * Every locale file must implement ALL keys.
 */
export interface Translations {
  // NavBar
  nav: {
    buy: string;
    rent: string;
    sell: string;
    savedHomes: string;
  };
  // HeroSearch
  hero: {
    heading: string;
    headingHighlight: string;
    searchPlaceholder: string;
    searchButton: string;
    filterAll: string;
    filterHouse: string;
    filterApartment: string;
    filterVilla: string;
    filterPenthouse: string;
    filters: string;
  };
  // Home Page sections
  home: {
    featuredTitle: string;
    featuredSubtitle: string;
    viewAll: string;
    newInMarket: string;
    newInMarketSubtitle: string;
    all: string;
    buy: string;
    rent: string;
  };
  // Property Card
  propertyCard: {
    beds: string;
    baths: string;
    perMonth: string;
  };
  // Property Detail Page
  propertyDetail: {
    featured: string;
    isNew: string;
    viewAllPhotos: string;
    scheduleVisit: string;
    contactAgent: string;
    topRatedAgent: string;
    propertyFeatures: string;
    squareMeters: string;
    bedrooms: string;
    bathrooms: string;
    garage: string;
    aboutHome: string;
    readMore: string;
    amenities: string;
    estimatedPayment: string;
    startingFrom: string;
    withDownPayment: string;
    calculateMortgage: string;
  };
  // Search Filters Modal
  filters: {
    title: string;
    location: string;
    locationPlaceholder: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
    propertyType: string;
    anyType: string;
    house: string;
    apartment: string;
    condo: string;
    townhouse: string;
    bedrooms: string;
    bathrooms: string;
    amenitiesTitle: string;
    swimmingPool: string;
    gym: string;
    parking: string;
    airConditioning: string;
    highSpeedWifi: string;
    patioTerrace: string;
    clearAll: string;
    showHomes: string;
  };
  // Pagination
  pagination: {
    previous: string;
    next: string;
  };
  // Footer
  footer: {
    rights: string;
  };
  // Language Selector
  languageSelector: {
    label: string;
  };
}
