import { DefaultCarFilters, FBCarFilters } from "../interfaces"
import { FBCarType, FBCondition } from "../interfaces/facebookTypes";

const facebookFiltersParser = (filters: DefaultCarFilters): FBCarFilters => {
  console.log('Filters: ', filters);
  
  let newFilters: FBCarFilters = {};
  if (filters.sort) {
    switch (filters.sort) {
      case 'price':
        newFilters.sortBy = filters.reversed_sort ? 'price_descend' : 'price_ascend';
        break;
      case 'year':
        newFilters.sortBy = filters.reversed_sort ? 'vehicle_year_ascend': 'vehicle_year_descend';
        break;
      case 'mileage':
        newFilters.sortBy = filters.reversed_sort ? 'vehicle_mileage_descend' : 'vehicle_mileage_ascend';
        break;
      case 'distance':
        newFilters.sortBy = filters.reversed_sort ? 'distance_descend' : 'distance_ascend';
        break;
      case 'date':
        newFilters.sortBy = filters.reversed_sort ? 'creation_time_descend' : 'creation_time_ascend';
        break;
      default:
        break;
    }
  }

  if (filters.sellerType) {
    switch (filters.sellerType) {
      case 'private':
        newFilters.sellerType = 'individual';
        break;
      case 'dealer':
        newFilters.sellerType = 'dealership';
        break;
      default:
        break;
    }
  }

  if (filters.bodyType) {
    newFilters.carType = filters.bodyType
      .map((bodyType: string) => {
        switch (bodyType) {
          case 'pickup':
            return 'truck';
          case 'other':
            return 'other_body_style';
          default:
            return bodyType as FBCarType;
        }
      })
  }

  switch (filters.vehicleType) {
    case 'auto':
      newFilters.topLevelVehicleType = 'car_truck';
      break;
    case 'pickup':
      newFilters.topLevelVehicleType = 'car_truck';
      newFilters.carType = ['truck'];
      break;
    case 'rv-camper':
      newFilters.topLevelVehicleType = 'rv-camper';
      break;
    default:
      break;
  }

  if (filters.condition) {
    newFilters.itemCondition = filters.condition
      .map((condition: string) => {
        switch (condition) {
          case 'New':
            return 'new';
          default:
            return `used_${condition.toLowerCase().replace(' ', '_')}` as FBCondition;
        }
      })
  }

  if (filters.location) newFilters.location = filters.location;
  if (filters.make) newFilters.make = filters.make;
  if (filters.model) newFilters.model = filters.model;
  if (filters.transmission) newFilters.transmissionType = filters.transmission;
  if (filters.distance) newFilters.distance = filters.distance;
  if (filters.minPrice) newFilters.minPrice = filters.minPrice;
  if (filters.maxPrice) newFilters.maxPrice = filters.maxPrice;
  if (filters.minYear) newFilters.minYear = filters.minYear;
  if (filters.maxYear) newFilters.maxYear = filters.maxYear;
  if (filters.minMileage) newFilters.minMileage = filters.minMileage;
  if (filters.maxMileage) newFilters.maxMileage = filters.maxMileage;
  if (filters.color) newFilters.exteriorColor = filters.color;

  return newFilters;
}

export default facebookFiltersParser