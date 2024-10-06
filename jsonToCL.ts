import { DefaultCarFilters } from './src/interfaces';
import CraigslistScraper from './src/utils/craigslistScraper';
import CraigslistFiltersParser from './src/utils/clFiltersParser';

(async () => {
  let location = "San Diego, CA";
  const json: DefaultCarFilters = {
    "sort": "default",
    "source": [
        "Facebook",
        "Craigslist"
    ],
    "sellerType": "dealer",
    "distance": 32,
    "location": "Foxboro, MA",
    "vehicleType": "auto",
    "make": "mazda",
    "bodyType": [
        "pickup",
        "sedan",
        "suv"
    ],
    "transmission": "manual"
}

  const craigslistFilters = CraigslistFiltersParser(json);
  console.log(craigslistFilters);

  const craigslistData = await CraigslistScraper(json.location? json.location : location, craigslistFilters);
  console.log(craigslistData);
})()