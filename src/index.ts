import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import craigslistScraper from './utils/craigslistScraper';
import facebookScraper from './utils/facebookScraper';
import { DefaultCarFilters, FoundCar } from './interfaces';
import facebookFiltersParser from './utils/fbFiltersParser';
import craigslistFiltersParser from './utils/clFiltersParser';

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
    console.log(filters);
    console.log(filters.location);
    
    
    /* const location = filters?.location || 'San Diego, CA'; */

    let craigslistPromise = Promise.resolve<FoundCar[]>([]);
    let facebookPromise = Promise.resolve<FoundCar[]>([]);

    if (filters.source?.includes('Craigslist') || !filters.source) {
      craigslistPromise = craigslistScraper(craigslistFiltersParser(filters));
    }
    if (filters.source?.includes('Facebook') || !filters.source) {
      facebookPromise = facebookScraper( facebookFiltersParser(filters));
    }

    const [craigslistData, facebookData] = await Promise.all([craigslistPromise, facebookPromise]);

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
  } catch (error) {
    console.error('Error processing car data:', error);
    res.status(500).json({ error: 'An error occurred while processing car data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});