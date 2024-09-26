import { chromium, Page } from 'playwright';
import { CLCarFilters, CLRVFilters, FoundCar as Car } from '../interfaces';
import { E_RVType, EAutoBodyType, ECondition } from '../interfaces/craigslistTypes';
import { writeFileSync } from 'fs';

const CAR_ITEM_CLASS = 'li.cl-search-result';
/* const CLOSE_LOGIN_BUTTON_SELECTOR = "div[aria-label='Close']";
const GOTO_LOCATION_SELECTOR = ".xod5an3 div#seo_filters > div[role='button']"; */

""
const removeDistanceFromCookies = (url: string): string => {
  const cookies = url.split('?')[1].split('#')[0].split('&').filter((item) => !item.includes('search_distance'));
  return cookies.join(`&`);
}

const gotoLocation = async (page: Page, location: string) => {
  await page.click(".cl-header .cl-left-group .cl-breadcrumb");
  await page.waitForSelector(".bd-for-bd-combo-box.bd-list-box.below div .items", { state: "attached" });
  await page.getByText("use map...").click();
  await page.waitForSelector(".cl-clickable-scrim .cl-popup-panel.fit-to-content.in-box", { state: "attached" });
  await page.fill("input[placeholder='city or zip/postal code']", location);
  await page.keyboard.press('Backspace');
  await page.keyboard.press(`${location.at(-1)}`);
  await page.waitForSelector(".cl-search-dropdown-results", { state: "visible" });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4500);
  await page.click(".apply-button")
  await page.waitForTimeout(1500);
}

const extractCarInfo = (elements: Element[]): Car[] => {
  const selectors = {
    url: '.cl-gallery a',
    img: '.cl-gallery a img',
    title: '.gallery-card a span.label',
    /* oldPrice: 'div > span.x78zum5 > .x78zum5 span.x1mnrxsn > span.x193iq5w', */
    newPrice: '.gallery-card span.priceinfo',
    monthlyPayment: '.gallery-card span.priceinfo span.monthly-pmt',
    locationAndMileage: '.gallery-card .meta',
  };

  return elements.map((el) => {
    const url = el.querySelector(selectors.url)?.getAttribute('href');
    const img = el.querySelector(selectors.img)?.getAttribute('src');
    const title = el.querySelector(selectors.title)?.textContent;
    /* let oldPrice = el.querySelector(selectors.oldPrice)?.textContent; */
    let newPrice = el.querySelector(selectors.newPrice)?.textContent;
    let monthlyPayment = el.querySelector(selectors.monthlyPayment)?.textContent;
    const metadata = el.querySelector(selectors.locationAndMileage)?.textContent?.split('·');
    const mileage = metadata?.[1];

    /* oldPrice = oldPrice === 'Free' ? '$0' : oldPrice; */
    newPrice = newPrice === 'Free' ? '$0' : newPrice;

    return {
      url: url ?? '',
      img: img ?? '',
      title: title ?? '',
      /* oldPrice: oldPrice ? Number(oldPrice.replace('$', '').replace(',', '')) : undefined, */
      newPrice: newPrice ? Number(newPrice.replace('$', '').replace(',', '')) : 0,
      monthlyPayment: monthlyPayment ? Number(monthlyPayment.replace('$', '').replace(',', '').replace('/mo', '')) : undefined,
      location: metadata?.[2] ?? '',
      mileage: mileage ? Number(mileage.replace('mi', '').replace('k', '000')) : 0,
    };
  }).filter((car) => 
    !!car.url && !!car.title && !!car.newPrice && !!car.mileage
  );
};

const craigslistScraper = async (location: string, filters?: CLCarFilters | CLRVFilters): Promise<Car[]> => {
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
  await gotoLocation(page, location);
  const newCookies = `${removeDistanceFromCookies(page.url())}&${cookies.join('&')}`;
  await page.goto(`${page.url().split('?')[0]}?${newCookies}`);
  await page.waitForSelector(CAR_ITEM_CLASS, { state: "attached" });
  await page.hover(".results.cl-results-page ol")
  /* loop scrolling on li elements until reach bottom witha delay of 100ms each iteration */
  for (let i = 0; i < 14338; i += 332) {
    await page.waitForTimeout(5);
    await page.evaluate(() => {
      window.scrollBy(0, 332);
    });
  }

  const cars = await page.$$eval(CAR_ITEM_CLASS, extractCarInfo);
  
  await browser.close();
  return cars;
};

// Example usage
(async () => {
  const cars = await craigslistScraper("Providence, RI", {
    vehicleType: 'trucks',
    sort: 'priceasc',
    search_distance: 12,
  });

  writeFileSync('./scrapedData.ts', JSON.stringify(cars));
})();

export default craigslistScraper



