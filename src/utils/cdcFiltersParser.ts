import { CarsDotComFilters, DefaultCarFilters } from "../interfaces";

const carsDotComFiltersParser =  (filters: DefaultCarFilters): CarsDotComFilters => {
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

  if (filters.location) newFilters.zip = filters.location;
  if (filters.minPrice) newFilters.list_price_min = filters.minPrice;
  if (filters.maxPrice) newFilters.list_price_max = filters.maxPrice;
  if (filters.minYear) newFilters.year_min = filters.minYear;
  if (filters.maxYear) newFilters.year_max = filters.maxYear;
  if (filters.maxMileage) newFilters.mileage_max = filters.maxMileage;
  if (filters.fuelType) newFilters["fuel_slugs[]"] = filters.fuelType;
  if (filters.bodyType) newFilters["body_style_slugs[]"] = filters.bodyType;
  if (filters.transmission) newFilters["transmission_slugs[]"] = filters.transmission;
  if (filters.color) newFilters["exterior_color_slugs[]"] = filters.color;
  if (filters.make) newFilters["makes[]"] = [filters.make];
  if (filters.model) newFilters["models[]"] = [filters.model];
  if (filters.sellerType) newFilters["seller_type[]"] = filters.sellerType;
  
  return newFilters;
}

export default carsDotComFiltersParser;