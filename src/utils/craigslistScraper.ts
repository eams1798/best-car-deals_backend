import { chromium, Page } from 'playwright';
import { CLCarFilters, CLRVFilters, FoundCar as Car } from '../interfaces';
import { E_RVType, EAutoBodyType, ECondition } from '../interfaces/craigslistTypes';
import { writeFileSync } from 'fs';

const CAR_ITEM_CLASS = '.cl-search-result';

const removeDistanceFromCookies = (url: string): string => {
  const cookies = url.split('?')[1].split('#')[0].split('&').filter((item) => !item.includes('search_distance'));
  return cookies.join(`&`);
}

const gotoLocation = async (page: Page, location: string) => {
  await page.waitForSelector(".cl-header .cl-left-group .cl-breadcrumb", { timeout: 6000 });
  await page.click(".cl-header .cl-left-group .cl-breadcrumb");

  await page.waitForSelector(".bd-for-bd-combo-box.bd-list-box.below div .items", { state: "attached", timeout: 6000 });

  await page.waitForSelector(".bd-button.text-only.use-map.link-like span", { timeout: 6000 });
  await page.click(".bd-button.text-only.use-map.link-like span")

  await page.waitForSelector(".cl-clickable-scrim .cl-popup-panel.fit-to-content.in-box", { state: "attached", timeout: 6000 });

  await page.waitForSelector("input[placeholder='city or zip/postal code']", { timeout: 6000 });
  await page.fill("input[placeholder='city or zip/postal code']", location);

  await page.keyboard.press('Backspace');
  await page.keyboard.press(`${location.at(-1)}`);

  await page.waitForSelector(".cl-search-dropdown-results", { state: "visible", timeout: 6000 });

  await page.keyboard.press('Enter');
  await page.waitForTimeout(4500);

  await page.waitForSelector(".apply-button", { timeout: 6000 });
  await page.click(".apply-button")

  await page.waitForTimeout(1500);
}

const extractCarInfo = (elements: Element[]): Car[] => {
  const selectors = {
    url: '.cl-gallery a',
    img: '.cl-gallery a img',
    title: '.gallery-card a span.label',
    newPrice: '.gallery-card span.priceinfo',
    monthlyPayment: '.gallery-card span.priceinfo span.monthly-pmt',
    locationAndMileage: '.gallery-card .meta',
  };

  console.log("is it working?");

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

    newPrice = newPrice === 'Free' ? '$0' : newPrice;

    return {
      source: 'Craigslist',
      url: url ?? '',
      img: img ?? '',
      title: title ?? '',
      newPrice: newPrice ? Number(newPrice.replace('$', '').replace(',', '')) : 0,
      monthlyPayment: monthlyPayment ? Number(monthlyPayment.replace('$', '').replace(',', '').replace('/mo', '')) : undefined,
      location: metadata?.[2] ?? '',
      mileage: mileage ? Number(mileage.replace('mi', '').replace('k', '000')) : 0,
    };
  }).filter((car) => 
    !!car.url && !!car.title && !!car.newPrice && !!car.mileage
  );
};

const craigslistScraper = async (filters?: CLCarFilters | CLRVFilters): Promise<Car[]> => {
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
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://www.craigslist.org/search/${carCategory}`);
  await gotoLocation(page, filters?.location ?? 'San Francisco, CA');
  const newCookies = `${removeDistanceFromCookies(page.url())}&${cookies.join('&')}`;
  await page.goto(`${page.url().split('?')[0]}?${newCookies}`);

  await page.waitForSelector(CAR_ITEM_CLASS, { state: "attached", timeout: 120000 });

  await page.waitForSelector(".results.cl-results-page ol", { timeout: 6000 });
  await page.hover(".results.cl-results-page ol")
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



