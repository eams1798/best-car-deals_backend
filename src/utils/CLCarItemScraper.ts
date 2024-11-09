import { chromium, Page } from 'playwright';
import { Car } from '../interfaces';
import { cleanObject } from './cleanObject';

const CAR_YEAR_SELECTOR = ".attrgroup .attr .valu.year";
const CAR_TITLE_SELECTOR = ".attrgroup .attr .valu.makemodel";
const CAR_CONDITION_SELECTOR = ".attrgroup .attr.condition .valu";
const CAR_PRICE_SELECTOR = ".postingtitletext .price";
const CAR_MONTHLY_PAY_SELECTOR = ".attrgroup .attr.monthly_payment .valu";
const CAR_LOCATION_SELECTOR = ".postingtitletext span"; /* nth(2) */
const CAR_MILEAGE_SELECTOR = ".attrgroup .attr.auto_miles .valu";
const CAR_IMG_SELECTOR  =".gallery .swipe .swipe-wrap > div img";
const CAR_TRANSMISSION_SELECTOR = ".attrgroup .attr.auto_transmission .valu";
const CAR_COLOR_SELECTOR = ".attrgroup .attr.auto_paint .valu";
const CAR_TITLE_STATUS_SELECTOR = ".attrgroup .attr.auto_title_status .valu";
const CAR_FUEL_TYPE_SELECTOR = ".attrgroup .attr.auto_fuel_type .valu";
const CAR_DESCRIPTION_SELECTOR = "#postingbody";

const getCarData = async (page: Page): Promise<Car> => {
  let year = "", title = "", condition = "", price = "", monthlyPayment = "",
      location = "", mileageText = "", image = "", transmission = "",
      exteriorColor = "", titleStatus = "", fuelType = "", description = "";
  
  try {
    await page.locator(CAR_YEAR_SELECTOR).waitFor({ timeout: 50 });
    year = await page.locator(CAR_YEAR_SELECTOR).innerText();
  } catch {
    year = "";
  }

  try {
    await page.locator(CAR_TITLE_SELECTOR).waitFor({ timeout: 50 });
    title = await page.locator(CAR_TITLE_SELECTOR).innerText();
  } catch {
    title = "";
  }

  try {
    await page.locator(CAR_CONDITION_SELECTOR).waitFor({ timeout: 50 });
    condition = await page.locator(CAR_CONDITION_SELECTOR).innerText();
  } catch {
    condition = "";
  }

  try {
    await page.locator(CAR_PRICE_SELECTOR).waitFor({ timeout: 50 });
    price = await page.locator(CAR_PRICE_SELECTOR).innerText();
    price = price.replace("$", "").replace(",", "").trim() ?? '';
  } catch {
    price = "";
  }

  try {
    await page.locator(CAR_LOCATION_SELECTOR).nth(2).waitFor({ timeout: 50 });
    location = await page.locator(CAR_LOCATION_SELECTOR).nth(2).innerText();
    location = location.replace("(", "").replace(")", "").trim() ?? '';
  } catch {
    location = "";
  }

  try {
    await page.locator(CAR_MONTHLY_PAY_SELECTOR).waitFor({ timeout: 50 });
    monthlyPayment = await page.locator(CAR_MONTHLY_PAY_SELECTOR).innerText();
    monthlyPayment = monthlyPayment
                      .replace("$", "").replace(",", "").trim() ?? '';
  } catch {
    monthlyPayment = "";
  }

  try {
    await page.locator(CAR_MILEAGE_SELECTOR).waitFor({ timeout: 50 });
    mileageText = await page.locator(CAR_MILEAGE_SELECTOR).innerText()
    mileageText = mileageText
                  .replace(",", "").trim() ?? '';
  } catch {
    mileageText = "";
  }

  try {
    await page.locator(CAR_IMG_SELECTOR).waitFor({ timeout: 50 });
    image = await page.locator(CAR_IMG_SELECTOR).getAttribute('src') ?? '';
  } catch {
    image = "";
  }

  try {
    await page.locator(CAR_TRANSMISSION_SELECTOR).waitFor({ timeout: 50 });
    transmission = await page.locator(CAR_TRANSMISSION_SELECTOR).innerText()
  } catch {
    transmission = "";
  }

  try {
    await page.locator(CAR_COLOR_SELECTOR).waitFor({ timeout: 50 });
    exteriorColor = await page.locator(CAR_COLOR_SELECTOR).innerText();
  } catch {
    exteriorColor = "";
  }

  try {
    await page.locator(CAR_TITLE_STATUS_SELECTOR).waitFor({ timeout: 50 });
    titleStatus = await page.locator(CAR_TITLE_STATUS_SELECTOR).innerText();
  } catch {
    titleStatus = "";
  }

  try {
    await page.locator(CAR_FUEL_TYPE_SELECTOR).waitFor({ timeout: 50 });
    fuelType = await page.locator(CAR_FUEL_TYPE_SELECTOR).innerText()
  } catch {
    fuelType = "";
  }

  try {
    await page.locator(CAR_DESCRIPTION_SELECTOR).nth(0).waitFor({ timeout: 50 });
    description = await page.locator(CAR_DESCRIPTION_SELECTOR).nth(0).innerText();
  } catch {
    description = "";
  }

  const carItem: Car = {
    url: page.url(),
    year: Number(year),
    title,
    condition,
    price: Number(price),
    monthlyPayment: Number(monthlyPayment),
    location,
    mileage: Number(mileageText),
    image,
    transmission,
    exteriorColor,
    titleStatus,
    fuelType,
    description
  }

  return cleanObject(carItem) as Car;
}

export const CLCarItemScraper = async (url: string): Promise<Car> => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const car = await getCarData(page);
              
  await browser.close();

  return car;
}

/* (async () => {
  const url = `
https://providence.craigslist.org/ctd/d/hyannis-2015-audi-a4/7800456160.html`

const car = await CLCarItemScraper(url);
  console.log(car);
})() */
