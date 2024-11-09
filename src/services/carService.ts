import { DefaultCarFilters, FoundCar } from '../interfaces';
import { stateMap } from '../utils/stateMap';
import craigslistFiltersParser from '../utils/clFiltersParser';
import craigslistScraper from '../utils/craigslistScraper';
import facebookFiltersParser from '../utils/fbFiltersParser';
import facebookScraper from '../utils/facebookScraper';

interface CarFilters {
  source?: string[];
  location?: string;
  sort?: 'price' | 'year' | 'mileage';
  reversed_sort?: boolean;
  [key: string]: any;
}

/* TODO */

export const fetchCraigslistData = async (filters: DefaultCarFilters): Promise<FoundCar[]> => {
  /* if (!filters.source?.includes('Craigslist') && filters.source) {
    return [];
  } */

  const parsedFilters = craigslistFiltersParser(filters);
  
  try {
    return await craigslistScraper(parsedFilters);
  } catch (e) {
    if (parsedFilters.location) {
      const [city, state] = parsedFilters.location.split(', ');
      const newLocation = `${city}, ${stateMap[state]}`;
      return await craigslistScraper({
        ...parsedFilters,
        location: newLocation,
      });
    }
    throw e;
  }
};

export const fetchFacebookData = async (filters: DefaultCarFilters): Promise<FoundCar[]> => {
  if (!filters.source?.includes('Facebook') && filters.source) {
    return [];
  }

  const parsedFilters = facebookFiltersParser(filters);
  try {
    return await facebookScraper(parsedFilters);
  } catch (e) {
    if (parsedFilters.location) {
      const [city, state] = parsedFilters.location.split(', ');
      const newLocation = `${city}, ${stateMap[state]}`;
      return await facebookScraper({
        ...parsedFilters,
        location: newLocation,
      });
    }
    throw e;
  }
};

const sortByProperty = (a: FoundCar, b: FoundCar, property: string, reversed: boolean = false): number => {
  switch (property) {
    case 'price':
      return reversed ? b.newPrice - a.newPrice : a.newPrice - b.newPrice;
    case 'year': {
      const aYear = Number(a.title.match(/(\d{4})/)?.[1]);
      const bYear = Number(b.title.match(/(\d{4})/)?.[1]);
      return reversed ? bYear - aYear : aYear - bYear;
    }
    case 'mileage':
      return reversed ? b.mileage - a.mileage : a.mileage - b.mileage;
    default:
      return 0;
  }
};

export const combineAndSortData = (
  craigslistData: FoundCar[],
  facebookData: FoundCar[],
  sort?: string,
  reversed_sort: boolean = false
): FoundCar[] => {
  if (!sort || !['price', 'year', 'mileage'].includes(sort)) {
    return interleaveArrays(craigslistData, facebookData);
  }

  return [...craigslistData, ...facebookData].sort((a, b) => 
    sortByProperty(a, b, sort, reversed_sort)
  );
};

const interleaveArrays = (arr1: FoundCar[], arr2: FoundCar[]): FoundCar[] => {
  const result: FoundCar[] = [];
  let i = 0, j = 0;

  while (i < arr1.length && j < arr2.length) {
    result.push(arr1[i++]);
    result.push(arr2[j++]);
  }

  while (i < arr1.length) {
    result.push(arr1[i++]);
  }

  while (j < arr2.length) {
    result.push(arr2[j++]);
  }

  return result;
};