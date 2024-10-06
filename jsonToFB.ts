import { DefaultCarFilters } from './src/interfaces';
import facebookScraper from './src/utils/facebookScraper';
import facebookFiltersParser from './src/utils/fbFiltersParser';

(async () => {
  let location = "San Diego, CA";
  const json: DefaultCarFilters = {
    "sort": "default",
    "reversed_sort": false,
    "source": [
        "Facebook",
        "Craigslist"
    ],
    "sellerType": "all",
    "location": "Providence, RI",
    "distance": 32,
    "vehicleType": "auto",
    "make": "ford",
    "bodyType": [
        "sedan",
        "suv",
        "pickup"
    ]
}

  const facebookFilters = facebookFiltersParser(json);
  console.log(facebookFilters);

  const facebookData = await facebookScraper(facebookFilters);
  console.log(facebookData);
})()