import { DefaultCarFilters } from '../src/interfaces';
import CarsDotComScraper from '../src/utils/carsDotComScraper';
import CDCFiltersParser from '../src/utils/cdcFiltersParser';

(async () => {
  const json: DefaultCarFilters = {
    "sort": "default",
    "source": [
      "Cars.com",
    ],
    "sellerType": "dealer",
    "distance": 32,
    "location": "02703",
    "vehicleType": "auto",
    "make": "mazda",
    "bodyType": [
      "pickup",
      "sedan",
      "suv"
    ],
    "transmission": "manual"
}

  const carsDotComFilters = CDCFiltersParser(json);
  console.log(carsDotComFilters);  

  const craigslistData = await CarsDotComScraper(carsDotComFilters);
  console.log(craigslistData);
})()