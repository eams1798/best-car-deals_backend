import { chromium, Page } from 'playwright';
import { Car } from '../interfaces';
import { cleanObject } from './cleanObject';

const CLOSE_LOGIN_BUTTON_SELECTOR = "div[aria-label='Close']";
const CAR_TITLE_SELECTOR = ".xyamay9 div h1 span.x193iq5w";
const CAR_PRICE_SELECTOR = ".xyamay9 .x1xmf6yo div span.x193iq5w";
const CAR_LOCATION_SELECTOR = ".x9f619 > .x9f619 > .x1yztbdb > div > span a;"
const CAR_MILEAGE_SELECTOR = ".xod5an3 .x1gslohp .x78zum5";
const CAR_IMG_SELECTOR  =".xal61yo .x6s0dn4 .x6s0dn4 > span > div > img";
const CAR_TRANSMISSION_SELECTOR = ".xod5an3 .x1gslohp .x78zum5";
const CAR_COLOR_SELECTOR = ".xod5an3 .x1gslohp .x78zum5";
const CAR_FUEL_TYPE_SELECTOR = ".xod5an3 .x1gslohp .x78zum5";
const CAR_MPG_SELECTOR = ".xod5an3 .x1gslohp .x78zum5";
const CAR_OWNERS_SELECTOR = ".xod5an3 .x1gslohp .x78zum5";
const CAR_DESCRIPTION_SELECTOR = ".xod5an3 > .x1gslohp > .xexx8yu > .xz9dl7a > div > span.x193iq5w";
const SEE_MORE_BTN_SELECTOR = ".xod5an3 .x1gslohp .xexx8yu .xz9dl7a div span.x193iq5w";
const CAR_NHTSA_SELECTOR = ".xod5an3 .x1gslohp .x78zum5";

const getCarData = async (page: Page): Promise<Car> => {
  let title = "", price = "", location = "",
      mileageText = "", image = "", transmission = "",
      interiorColor = "", exteriorColor = "", fuelType = "",
      MPGCity = "", MPGHighway = "", MPGCombined = "",
      description = "", owners = "", safetyRate = "";
  try {
    await page.locator(CAR_TITLE_SELECTOR).waitFor({ timeout: 50 });
    title = await page.locator(CAR_TITLE_SELECTOR).innerText();
  } catch {
    title = "";
  }

  try {
    await page.locator(CAR_PRICE_SELECTOR).waitFor({ timeout: 50 });
    price = await page.locator(CAR_PRICE_SELECTOR).innerText();
    price = price.replace("$", "").replace(",", "").trim() ?? '';
  } catch {
    price = "";
  }

  try {
    await page.locator(CAR_LOCATION_SELECTOR).waitFor({ timeout: 50 });
    location = await page.locator(CAR_LOCATION_SELECTOR).innerText();
  } catch {
    location = "";
  }

  try {
    await page.locator(CAR_MILEAGE_SELECTOR).getByText("Driven").waitFor({ timeout: 50 });
    mileageText = await page.locator(CAR_MILEAGE_SELECTOR).getByText("Driven").innerText()
    mileageText = mileageText
                  .replace("Driven", "").replace("miles", "")
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
    await page.locator(CAR_TRANSMISSION_SELECTOR).getByText("Transmission").waitFor({ timeout: 50 });
    transmission = await page.locator(CAR_TRANSMISSION_SELECTOR).getByText("transmission").innerText()
    transmission = transmission.replace("transmission", "").trim();
  } catch {
    transmission = "";
  }

  try {
    await page.locator(CAR_COLOR_SELECTOR).getByText("Color").waitFor({ timeout: 50 });
    const color = await page.locator(CAR_COLOR_SELECTOR).getByText("color").innerText();
    [exteriorColor, interiorColor] = color.split(" · ");    
    exteriorColor = exteriorColor.replace("Exterior color: ", "").trim();
    interiorColor = interiorColor.replace("Interior color: ", "").trim();
  } catch {
    exteriorColor = "";
    interiorColor = "";
  }

  try {
    await page.locator(CAR_FUEL_TYPE_SELECTOR).getByText("Fuel Type").waitFor({ timeout: 50 });
    fuelType = await page.locator(CAR_FUEL_TYPE_SELECTOR).getByText("Fuel Type").innerText()
    fuelType = fuelType.replace("Fuel type: ", "").trim();
  } catch {
    fuelType = "";
  }

  try {
    await page.locator(CAR_MPG_SELECTOR).getByText("MPG").waitFor({ timeout: 50 });
    const MPGtext = await page.locator(CAR_MPG_SELECTOR).getByText("MPG").innerText();
    [MPGCity, MPGHighway, MPGCombined] = MPGtext.split(" · ").map((x) => x.replace("MPG", "").trim());
    MPGCity = MPGCity.replace("city", "").trim();    
    MPGHighway = MPGHighway.replace("highway", "").trim();
    MPGCombined = MPGCombined.replace("combined", "").trim();
  } catch {
    MPGCity = "";
    MPGHighway = "";
    MPGCombined = "";
  }

  try {
    await page.locator(CAR_OWNERS_SELECTOR).getByText("owner").waitFor({ timeout: 50 });
    owners = await page.locator(CAR_OWNERS_SELECTOR).getByText("owner").innerText()
    owners = owners.replace("owner", "").replace("s", "").trim()
  } catch {
    owners = "";
  }

  try {
    await page.waitForSelector(CAR_DESCRIPTION_SELECTOR, { timeout: 50 });
    await page.locator(SEE_MORE_BTN_SELECTOR).getByText("See more").waitFor({ timeout: 50 });
    await page.locator(SEE_MORE_BTN_SELECTOR).getByText("See more").click();
    await page.waitForTimeout(50);
    description = await page.locator(CAR_DESCRIPTION_SELECTOR).innerText()
    description = description.replace("See less", "").trim()
  } catch {
    description = "";
  }

  try {
    await page.locator(CAR_NHTSA_SELECTOR).getByText("NHTSA safety rating").waitFor({ timeout: 50 });
    safetyRate = await page.locator(CAR_NHTSA_SELECTOR).getByText("NHTSA safety rating").innerText()
  } catch {
    safetyRate = "";
  }

  const carItem: Car = {
    url: page.url(),
    title,
    price: Number(price),
    location,
    image,
    mileage: Number(mileageText),
    owners: Number(owners),
    safetyRate,
    transmission,
    exteriorColor,
    interiorColor,
    fuelType,
    MPG: {
      city: Number(MPGCity),
      highway: Number(MPGHighway),
      combined: Number(MPGCombined)
    },
    description 
  }

  return cleanObject(carItem) as Car;
}

export const FBCarItemScraper = async (url: string): Promise<Car> => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  
  await page.waitForSelector(CLOSE_LOGIN_BUTTON_SELECTOR, { timeout: 6000 });
  await page.click(CLOSE_LOGIN_BUTTON_SELECTOR);

  await page.waitForTimeout(100);

  const car = await getCarData(page);
              
  await browser.close();

  return car;
}

/* (async () => {
  const url = `
https://www.facebook.com/marketplace/item/8507428869373992/?ref=category_feed&referral_code=undefined&referral_story_type=listing&tracking=%7B%22qid%22%3A%22-1068776012312251295%22%2C%22mf_story_key%22%3A%229476830438999516%22%2C%22commerce_rank_obj%22%3A%22%7B%5C%22target_id%5C%22%3A9476830438999516%2C%5C%22target_type%5C%22%3A0%2C%5C%22primary_position%5C%22%3A16%2C%5C%22ranking_signature%5C%22%3A2999580571623756559%2C%5C%22commerce_channel%5C%22%3A504%2C%5C%22value%5C%22%3A0.00040013430211808%2C%5C%22candidate_retrieval_source_map%5C%22%3A%7B%5C%229476830438999516%5C%22%3A111%7D%7D%22%7D  `
  const car = await FBCarItemScraper(url);
  console.log(car);
})()
 */