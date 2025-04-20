import { chromium } from 'playwright';
import { Car, CarsDotComFilters, DefaultCarFilters, FoundCar } from '../interfaces';

const extractCarInfo = (elements: Element[]): FoundCar[] => {
  return elements.map((el) => {
    const url = el.querySelector('a')?.getAttribute('href') || '';
    const image = el.querySelector('img.vehicle-image')?.getAttribute('src') || '';
    const title = el.querySelector('a.vehicle-card-link')?.textContent?.trim() || '';
    const newPrice = el.querySelector('.price-section')?.textContent?.trim() || '';
    const location = el.querySelector('.miles-from')?.textContent?.trim() || '';
    const mileage = el.querySelector('.mileage')?.textContent?.trim() || '';

    return {
      source: 'Cars.com',
      url: url ?? '',
      title: title ?? '',
      newPrice: newPrice? Number(newPrice.replace('$', '').replace(/,/g, '')): 0,
      location: location ?? '',
      mileage: mileage ? Number(mileage.replace(' miles', '').replace(/,/g, '')) : 0,
      image: image ?? '',
    };
  });
};

const carsDotComScraper = async (filters: CarsDotComFilters): Promise<FoundCar[]> => {
  const cookies: string[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (key !== 'fuel_slugs[]' && key !== 'body_style_slugs[]' && key !== 'makes[]' && key !== 'models[]' && value) {
      cookies.push(`${key}=${value}`);
    }
    if (key === 'fuel_slugs[]') {
      cookies.push(value.map((v: string) => `fuel_slugs[]=${v}`).join('&'));
    }
    if (key === 'body_style_slugs[]') {
      cookies.push(value.map((v: string) => `body_style_slugs[]=${v}`).join('&'));
    }
    if (key === 'makes[]') {
      cookies.push(value.map((v: string) => `makes[]=${v}`).join('&'));
    }
    if (key === 'models[]') {
      cookies.push(value.map((v: string) => `models[]=${v}`).join('&'));
    }
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = `https://www.cars.com/shopping/results/?${cookies.join('&')}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('.vehicle-card', { state: 'attached', timeout: 350000 });

  await page.hover('.vehicle-cards');
  for (let i = 0; i < 7828; i += 466) {
    await page.waitForTimeout(5);
    await page.evaluate(() => {
      window.scrollBy(0, 332);
    });
  }

  let carLocator = page.locator('.vehicle-card');
  const elements = await carLocator.evaluateAll(extractCarInfo);
  await browser.close();

  return elements
}

export default carsDotComScraper;