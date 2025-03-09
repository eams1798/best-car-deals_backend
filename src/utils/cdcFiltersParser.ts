import { CarsDotComFilters, DefaultCarFilters } from "../interfaces";

const carsDotComFiltersParser = (filters: DefaultCarFilters): CarsDotComFilters => {
  let newFilters: CarsDotComFilters = {};

  switch (filters.sort) {
    case 'price':
      newFilters.sort = filters.reversed_sort ? 'list_price_desc' : 'list_price';
      break;
    case 'year':
      newFilters.sort = filters.reversed_sort ? 'year_desc' : 'year';
      break;
    case 'mileage':
      newFilters.sort = filters.reversed_sort ? 'mileage_desc' : 'mileage';
      break;
    case 'date':
      newFilters.sort = filters.reversed_sort ? 'listed_at' : 'listed_at_desc';
      break;
    default:
      break;
  }

  
  return newFilters;
}

export default carsDotComFiltersParser;