import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import craigslistScraper from './utils/craigslistScraper';
import facebookScraper from './utils/facebookScraper';
import { DefaultCarFilters, FoundCar } from './interfaces';
import facebookFiltersParser from './utils/fbFiltersParser';
import craigslistFiltersParser from './utils/clFiltersParser';
import { stateMap } from './utils/stateMap';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/cars', async (req: Request, res: Response) => {
  try {
    const filters = req.body.filters;

    let craigslistPromise = Promise.resolve<FoundCar[]>([]);
    let facebookPromise = Promise.resolve<FoundCar[]>([]);

    if (filters.source?.includes('Craigslist') || !filters.source) {
      const parsedFilters = craigslistFiltersParser(filters);
      try {
        craigslistPromise = craigslistScraper(parsedFilters);
      } catch (e) {
        if (parsedFilters.location) {
          const [city, state] = parsedFilters.location.split(', ')
          let newLocation = city + ', ' + stateMap[state]
          craigslistPromise = craigslistScraper({
          ...parsedFilters,
          location: newLocation,
        })}
      }
    }
    if (filters.source?.includes('Facebook') || !filters.source) {
      const parsedFilters = facebookFiltersParser(filters);
      try {
        facebookPromise = facebookScraper(parsedFilters);
      } catch (e) {
        if (parsedFilters.location) {
          let [city, state] = parsedFilters.location.split(', ')
          const newLocation = city + ', ' + stateMap[state]
          console.log('newLocation: ', newLocation);
          
          facebookPromise = facebookScraper({
          ...parsedFilters,
          location: newLocation,
        })
      }
    }

    let craigslistData: FoundCar[] = [], facebookData: FoundCar[] = [];
    try {
      [craigslistData, facebookData] = await Promise.all([craigslistPromise, facebookPromise]);
    } catch (e) {
      if (parsedFilters.location) {
        let [city, state] = parsedFilters.location.split(', ')
        const newLocation = city + ', ' + stateMap[state]
        console.log('newLocation: ', newLocation);
        
        [craigslistData, facebookData] = await Promise.all([craigslistPromise, facebookScraper({
          ...parsedFilters,
          location: newLocation,
        })]);
      }
    }

    let combinedData: FoundCar[] = [];

    if (filters.sort !== 'price' && filters.sort !== 'year' && filters.sort !== 'mileage') {
      let i = 0, j = 0;

      while (i < craigslistData.length && j < facebookData.length) {
        combinedData.push(craigslistData[i]);
        i++;
        combinedData.push(facebookData[j]);
        j++;
      }

      while (i < craigslistData.length) {
        combinedData.push(craigslistData[i]);
        i++;
      }

      while (j < facebookData.length) {
        combinedData.push(facebookData[j]);
        j++;
      }
    } else {
      combinedData = [...craigslistData, ...facebookData]
                      .sort((a, b) => {
                        if (filters.sort === 'price') {
                          return filters.reversed_sort ? b.newPrice - a.newPrice : a.newPrice - b.newPrice;
                        } else if (filters.sort === 'year') {
                          const aYear = Number(a.title.match(/(\d{4})/)?.[1]);
                          const bYear = Number(b.title.match(/(\d{4})/)?.[1]);
                          return filters.reversed_sort ? bYear - aYear : aYear - bYear;
                        } else if (filters.sort === 'mileage') {
                          return filters.reversed_sort ? b.mileage - a.mileage : a.mileage - b.mileage;
                        } else {
                          return 0;
                        }
                      });
    }

    res.json(combinedData);
  }}
  catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});