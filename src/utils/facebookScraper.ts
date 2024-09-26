import { chromium, Page } from 'playwright';
import { FBCarFilters as Filters, FoundCar as Car } from '../interfaces';

const CAR_ITEM_CLASS = '.x9f619.x78zum5.x1r8uery.xdt5ytf.x1iyjqo2.xs83m0k.x1e558r4.x150jy0e.x1iorvi4.xjkvuk6.xnpuxes.x291uyu.x1uepa24';
const CLOSE_LOGIN_BUTTON_SELECTOR = "div[aria-label='Close']";
const GOTO_LOCATION_SELECTOR = ".xod5an3 div#seo_filters > div[role='button']";

const buildUrl = (cookies: string[]): string => {
  return `https://www.facebook.com/marketplace/category/vehicles?${cookies.join('&')}`;
};

const gotoLocation = async (page: Page, location: string) => {
  await page.click(CLOSE_LOGIN_BUTTON_SELECTOR);
  await page.click(GOTO_LOCATION_SELECTOR);
  await page.waitForSelector("div[aria-label='Change location']", { state: "attached" });
  await page.fill("input[aria-label='Location']", location);
  await page.waitForSelector(".xu96u03 .x1jx94hy div ul", { state: "visible" });
  await page.click(".xu96u03 .x1jx94hy div ul li:first-child");
}

const filterByDistance = async (page: Page, distance: number) => {
  let distanceToUse = 20;
  const distanceRanges = [1, 2, 5, 10, 20, 40, 60, 80, 100, 250, 500]

  for (let i = 0; i < distanceRanges.length - 1; i++) {
    if (distanceRanges[i] === distance) {distanceToUse = distanceRanges[i]; break;}
    else if (distanceRanges[i] < distance && distance <= distanceRanges[i + 1]) {distanceToUse = distanceRanges[i + 1]; break;}
  }
  await page.click("label[aria-label='Radius'] div div")
  await page.getByText(`${distanceToUse} miles`).click();
}

const extractCarInfo = (elements: Element[]): Car[] => {
  const selectors = {
    img: 'img',
    title: 'span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6',
    oldPrice: 'div > span.x78zum5 > .x78zum5 span.x1mnrxsn > span.x193iq5w',
    newPrice: 'div > span.x78zum5 > .x78zum5 > span.x193iq5w',
    location: 'div > span[aria-hidden="true"] > div.x1iorvi4 > span.x193iq5w span.x1lliihq',
    mileage: 'div > div.x1iorvi4 > span > span',
  };

  return elements.map((el) => {
    const url = el.querySelector('a')?.getAttribute('href');
    const img = el.querySelector(selectors.img)?.getAttribute('src');
    const title = el.querySelector(selectors.title)?.textContent;
    let oldPrice = el.querySelector(selectors.oldPrice)?.textContent;
    let newPrice = el.querySelector(selectors.newPrice)?.textContent;
    const location = el.querySelector(selectors.location)?.textContent;
    const mileage = el.querySelector(selectors.mileage)?.textContent;

    oldPrice = oldPrice === 'Free' ? '$0' : oldPrice;
    newPrice = newPrice === 'Free' ? '$0' : newPrice;

    return {
      url: url ? `https://www.facebook.com${url}` : '',
      img: img ?? '',
      title: title ?? '',
      oldPrice: oldPrice ? Number(oldPrice.replace('$', '').replace(',', '')) : undefined,
      newPrice: newPrice ? Number(newPrice.replace('$', '').replace(',', '')) : 0,
      location: location ?? '',
      mileage: mileage ? Number(mileage.replace('miles', '').replace('K', '000')) : 0,
    };
  }).filter((car) => 
    !!car.url && !!car.title && !!car.newPrice && !!car.mileage
  );
};

const removeOverlay = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const overlay = document.querySelector("div[data-nosnippet] div.x78zum5");
    if (overlay) overlay.remove();
  });
};

const facebookScraper = async (location: string, filters?: Filters): Promise<Car[]> => {
  const cookies: string[] = [];
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (key !== 'carType' && key !== 'carFaxHistory' && key !== 'itemCondition' && value) {
        cookies.push(`${key}=${value}`);
      }
    }
    if (filters.carType) cookies.push(`carType=${filters.carType.join(',')}`);
    if (filters.carFaxHistory) cookies.push(`carFaxHistory=${filters.carFaxHistory.join(',')}`);
    if (filters.itemCondition) cookies.push(`itemCondition=${filters.itemCondition.join(',')}`);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(buildUrl(cookies));

  await gotoLocation(page, location);
  await removeOverlay(page);

  if (filters?.distance) {
    await filterByDistance(page, filters.distance);
  }

  await page.click("div[aria-label='Apply'] div");
  await page.waitForTimeout(2500);

  const cars = await page.$$eval(CAR_ITEM_CLASS, extractCarInfo);
  
  await browser.close();
  return cars;
};

// Example usage
(async () => {
  const cars = await facebookScraper("Providence, RI", {
    carType: ['truck'],
    sortBy: 'vehicle_year_descend',
    distance: 12,
  });
  console.log(cars);
})();

export default facebookScraper