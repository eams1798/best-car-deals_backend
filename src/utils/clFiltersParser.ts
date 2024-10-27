import { CLRVFilters, DefaultCarFilters } from "../interfaces";
import { CLCarFilters } from "../interfaces";
import {
  EAutoTransmission,
  EAutoDriveTrain,
  EAutoCylinders,
  ECondition,
  EAutoBodyType,
  EAutoFuelType,
  EAutoPaint,
  EAutoTitleStatus,
  E_RVType
} from "../interfaces/craigslistTypes";

const extractValueFromEnum = (enumObject: any, enumValue: string) => {
  const enumobject = Object.values(enumObject);
  const length = enumobject.length;
  const keys = enumobject.slice(0, length / 2);
  const values = enumobject.slice(length / 2);

  return values[keys.indexOf(enumValue)];
}

const craigslistFiltersParser = (filters: DefaultCarFilters): CLCarFilters | CLRVFilters => {
  
  let newFilters: CLCarFilters | CLRVFilters = {};

  switch (filters.sort) {
    case 'price':
      newFilters.sort = filters.reversed_sort ? 'pricedsc' : 'priceasc';
      break;
    case 'date':
      newFilters.sort = filters.reversed_sort ? 'dateoldest' : 'date';
      break;
    default:
      break;
  }

  if (filters.transmission &&
    ['Auto', 'Manual', 'Other'].includes(filters.transmission)) {
    newFilters.auto_transmission = extractValueFromEnum(EAutoTransmission, filters.transmission) as EAutoTransmission;
  }

  if (filters.condition && 
    filters.condition.every((condition: string) => ['New', 'Like_New', 'Good', 'Fair'].includes(condition))
  ) {
    newFilters.condition = filters.condition.map((condition: string) => extractValueFromEnum(ECondition, condition) as ECondition);
  }

  if (filters.vehicleType === 'rv-camper') {
    if (filters.rv_type &&
      filters.rv_type.every((type: string) => ['Class A', 'Class B', 'Class C',
        'Fifth Wheel Trailer', 'Travel Trailer', 'Hybrid Trailer', 'Folding/Popup Trailer',
        'Teardrop/Compact Trailer', 'Toy Hauler', 'Truck Camper', 'Other'].includes(type))
    ) {
      (newFilters as CLRVFilters).rv_type = filters.rv_type.map((type: string) =>
        extractValueFromEnum(E_RVType, type) as E_RVType);
    }
  } else if (filters.vehicleType === 'pickup') {
    (newFilters as CLCarFilters).auto_bodytype = [EAutoBodyType.Pickup];
  } else {
    if (filters.bodyType &&
      filters.bodyType.every((type: string) => ['Sedan', 'SUV', 'Coupe',
        'Pickup', 'Hatchback', 'Wagon', 'Convertible', 'Minivan', 'Other'].includes(type))
    ) {
      (newFilters as CLCarFilters).auto_bodytype = filters.bodyType.map((type: string) =>
        extractValueFromEnum(EAutoBodyType, type) as EAutoBodyType);
    }
  }
  switch (filters.vehicleType) {
    case 'auto':
      newFilters.vehicleType = 'cars';
      break;
    case 'pickup':
      newFilters.vehicleType = 'trucks';
      break;
    case 'rv-camper':
      newFilters.vehicleType = 'rv-campers';
      break;
    default:
      break;
  }

  if (filters.color &&
    ['Black', 'Blue', 'Green', 'Grey', 'Orange', 'Purple',
      'Red', 'Silver', 'White', 'Yellow', 'Custom', 'Brown'].includes(filters.color)
  ) {
    newFilters.auto_paint = extractValueFromEnum(EAutoPaint, filters.color) as EAutoPaint;
  }

  if (filters.make && filters.model) {
    newFilters.auto_make_model = `${filters.make.toLowerCase()} ${filters.model.toLowerCase()}`;
  } else if (filters.make) {
    newFilters.auto_make_model = filters.make.toLowerCase();
  }

  switch (filters.sellerType) {
    case 'private':
      newFilters.purveyor = 'owner';
      break;
    case 'dealer':
      newFilters.purveyor = 'dealer';
      break;
    default:
      break;
  }

  if (filters.location) newFilters.location = filters.location;
  if (filters.minPrice) newFilters.min_price = filters.minPrice;
  if (filters.maxPrice) newFilters.max_price = filters.maxPrice;
  if (filters.minYear) newFilters.min_auto_year = filters.minYear;
  if (filters.maxYear) newFilters.max_auto_year = filters.maxYear;
  if (filters.minMileage) newFilters.min_auto_miles = filters.minMileage;
  if (filters.maxMileage) newFilters.max_auto_miles = filters.maxMileage;
  if (filters.distance) newFilters.search_distance = filters.distance;

  return newFilters;
};

export default craigslistFiltersParser;