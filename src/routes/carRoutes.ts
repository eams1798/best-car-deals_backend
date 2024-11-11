import { Router, Request, Response } from 'express';
import { 
  fetchCraigslistData, 
  fetchFacebookData, 
  combineAndSortData 
} from '../services/carService';
import { getCarAnalysis } from '../services/aiService';
import { FBCarItemScraper } from '../utils/FBCarItemScraper';
import { CLCarItemScraper } from '../utils/CLCarItemScraper';
import { Car, DefaultCarFilters } from '../interfaces';

const router = Router();


/* Entry point to check if server is running */
router.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});


/* Endpoint to fetch cars based on filters
 * 
 * @param {Object} req - Request object. The body contains the filters. The filters can be found in the interface DefaultCarFilters.
 * @param {Object} res - Response object
 */
router.post('/cars', async (req: Request, res: Response) => {
  try {
    const filters: DefaultCarFilters = req.body;
    console.log('filters: ', filters);

    /* TODO */
    const [craigslistData, facebookData] = await Promise.all([
      fetchCraigslistData(filters),
      fetchFacebookData(filters)
    ]);

    const combinedData = combineAndSortData(
      craigslistData, 
      facebookData, 
      filters.sort, 
      filters.reversed_sort
    );

    res.json(combinedData);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});


/* Endpoint to fetch cars from Facebook based on url
 * 
 * @param {Object} req - Request object. The body contains the url.
 * @param {Object} res - Response object
 */
router.post('/facebook', async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const car = await FBCarItemScraper(url);
    res.json(car);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});


/* Endpoint to fetch cars from craigslist based on url
 * 
 * @param {Object} req - Request object. The body contains the url.
 * @param {Object} res - Response object
 */
router.post('/craigslist', async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const car = await CLCarItemScraper(url);
    res.json(car);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});


/* Endpoint to get a car analysis from Claude AI
 * 
 * @param {Object} req - Request object. The body contains the details of the car. Details can be found in the interface Car.
 * @param {Object} res - Response object
 */
router.post('/ai-info', async (req: Request, res: Response) => {
  const data: Car = req.body;
  
  try {
    const stream = await getCarAnalysis(data);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        res.write(`data: ${JSON.stringify((chunk.delta as any).text)}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

export default router;