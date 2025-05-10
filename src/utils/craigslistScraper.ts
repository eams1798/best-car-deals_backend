import { chromium, Page } from 'playwright';
import { CLCarFilters, CLRVFilters, FoundCar } from '../interfaces';
import { E_RVType, EAutoBodyType, ECondition } from '../interfaces/craigslistTypes';
import { writeFileSync } from 'fs';

const CAR_ITEM_CLASS = '.cl-search-result';

const extractCarInfo = (elements: Element[]): FoundCar[] => {
  const selectors = {
    url: '.cl-gallery a',
    img: '.cl-gallery a img',
    title: '.gallery-card a span.label',
    newPrice: '.gallery-card span.priceinfo',
    monthlyPayment: '.gallery-card span.priceinfo span.monthly-pmt',
    locationAndMileage: '.gallery-card .meta',
  };

  const domparser = new DOMParser();

  return elements.map((el) => {
    const url = el.querySelector(selectors.url)?.getAttribute('href');
    const img = el.querySelector(selectors.img)?.getAttribute('src');
    const title = el.querySelector(selectors.title)?.textContent;
    let newPrice = el.querySelector(selectors.newPrice)?.textContent;
    let monthlyPayment = el.querySelector(selectors.monthlyPayment)?.textContent;
    const metadata = el.querySelector(selectors.locationAndMileage)?.outerHTML
                                                                    .replace('<div class="meta">', '').replace('</div>', '')
                                                                    .replace('<span class="separator"></span>', '·')
                                                                    .replace('<span class="separator"></span>', '·')
                                                                    .split('·');


    const mileage = metadata?.[1];
    const location = domparser.parseFromString(metadata?.[2] ?? '<p></p>', 'text/html').body.textContent ?? '';

    newPrice = newPrice === 'Free' ? '$0' : newPrice;

    return {
      source: 'Craigslist',
      url: url ?? '',
      img: img ?? '',
      title: title ?? '',
      newPrice: newPrice ? Number(newPrice.replace('$', '').replace(',', '')) : 0,
      monthlyPayment: monthlyPayment ? Number(monthlyPayment.replace('$', '').replace(',', '').replace('/mo', '')) : undefined,
      location,
      mileage: mileage ? Number(mileage.replace('mi', '').replace('k', '000')) : 0,
    };
  }).filter((car) => 
    !!car.url && !!car.title && !!car.newPrice && !!car.mileage
  );
};

const craigslistScraper = async (filters?: CLCarFilters | CLRVFilters): Promise<FoundCar[]> => {
  const cookies: string[] = [];
  let newFilters, carCategory ="cta";
  if (filters) {
    if (filters.vehicleType === 'rv-campers') {
      newFilters = ({...filters} as CLRVFilters);
      carCategory = 'rva';
    } else if (filters?.vehicleType === 'trucks') {
      newFilters = ({...filters, auto_bodytype: [EAutoBodyType.Pickup]} as CLCarFilters);
    } else {
      newFilters = ({...filters} as CLCarFilters);
    }

    for (const [key, value] of Object.entries(newFilters)) {
      if (key !== 'vehicleType' && key !== 'auto_bodytype' && key !== 'condition' && key !== 'rv_type' && value) {
        cookies.push(`${key}=${value}`);
      }
      if (key === 'auto_bodytype') {
        cookies.push(value.map((v: EAutoBodyType) => `auto_bodytype=${v}`).join('&'));
      }
      if (key === 'rv_type') {
        cookies.push(value.map((v: E_RVType) => `rv_type=${v}`).join('&'));
      }
      if (key === 'condition') {
        cookies.push(value.map((v: ECondition) => `condition=${v}`).join('&'));
      }
    }
  }
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const url = `https://www.craigslist.org/search/${carCategory}?${cookies.join('&')}`;
  await page.goto(`${url}`, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector(CAR_ITEM_CLASS, { state: "attached", timeout: 6000 });

  await page.waitForSelector(".scrolling-container", { timeout: 6000 });
  await page.hover(".scrolling-container")
  for (let i = 0; i < 14338; i += 332) {
    await page.waitForTimeout(5);
    await page.evaluate(() => {
      window.scrollBy(0, 332);
    });
  }

  let carLocator = page.locator(CAR_ITEM_CLASS)
  const elements = await carLocator.evaluateAll(extractCarInfo);

  await browser.close();
  return elements
};

// Example usage
/* (async () => {
  const cars =await craigslistScraper({
    vehicleType: 'trucks',
    sort: 'priceasc',
    search_distance: 12,
  });

  console.log(cars);
})(); */

export default craigslistScraper



