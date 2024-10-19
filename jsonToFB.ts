import { DefaultCarFilters } from './src/interfaces';
import facebookScraper from './src/utils/facebookScraper';
import facebookFiltersParser from './src/utils/fbFiltersParser';
import { stateMap } from './src/utils/stateMap';

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
    "location": "Nashua, NH",
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

  try{
    const facebookData = await facebookScraper(facebookFilters);
    console.log(facebookData);
  } catch (e) {
    if (facebookFilters.location) {
      const [city, state] = facebookFilters.location.split(', ')
      const newLocation = city + ', ' + stateMap[state]
      console.log('New Location: ', newLocation);
      
      const facebookData = await facebookScraper({
        ...facebookFilters,
        location: newLocation,
      })

      console.log(facebookData);
    }
  }
})()