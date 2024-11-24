# Car Merged Marketplace

This app is a marketplace showing cars from different sources (i.e. Facebook, Craigslist, etc.) using some given filters to bring you the best deal. You can also try the AI feature to get more information about the car you are interested in.

## Used stack

Frontend:

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places)

Backend:

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Playwright](https://playwright.dev/)
- [Google Gemini AI](https://ai.google.dev/)

## Project structure

The project is structured in the following way:

### Frontend:
- [`index.html`](https://github.com/eams1798/best-car-deals/blob/main/index.html): HTML file for the app. Contains the script to load the Google Maps API.
- [`server.cjs`](https://github.com/eams1798/best-car-deals/blob/main/server.cjs): Node.js server that runs the app on production.
- [`src/main.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/main.tsx): Entry point of the app. Contains the root component of the app, the router and the React Query client.
- [`src/App.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/App.tsx): Main component of the app. Contains the routes for the app.
- `src/components`: Contains the components of the app.
- [`src/components/MainPage.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MainPage.tsx): The landing page of the app. Contains a start form to begin car searching.
- [`src/components/GMPAutocompleteInput.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/GMPAutocompleteInput.tsx): Component for the Google Maps Autocomplete API to allow user to search and select from a list of cities or zipcodes.
- [`src/components/NotFound.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/NotFound.tsx): Component for the 404 page of the app.
- [`src/components/Marketplace/index.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MarketPlace/index.tsx): The main page of the marketplace. Contains a sidebar with all the filters and a list of the filtered cars.
- [`src/components/Marketplace/FiltersSidebar.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MarketPlace/FiltersSidebar.tsx): Component for the sidebar with all the filters such as seller type, vehicle type, price range, location, etc.
- [`src/components/MarketPlace/SortControls.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MarketPlace/SortControls.tsx): Component for the sort controls. Contains a dropdown to choose the sort order and a checkbox to reverse the sort order.
- [`src/components/MarketPlace/CarList.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MarketPlace/CarList.tsx): Component for the list of the filtered cars.
- [`src/components/MarketPlace/CarItem.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MarketPlace/CarItem.tsx): Component for each car item in the list. Contains a card with a brief information about the car such as image, title, price, mileage and location.
- [`src/components/MarketPlace/CLCarElement.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MarketPlace/CLCarElement.tsx) and [`src/components/MarketPlace/FBCarElement.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MarketPlace/FBCarElement.tsx): Components with the complete car information scraped from Craigslist or Facebook respectively. You can get additional information by clicking on the "Get tips by Claude AI" button to see if the car is worth buying.
- [`src/components/MarketPlace/AITips.tsx`](https://github.com/eams1798/best-car-deals/blob/main/src/components/MarketPlace/AITips.tsx): Component to show additional information about the car provied by Gemini, the Google AI model.
- `src/interfaces` folder: Contains the interfaces for the frontend.
- [`src/services/cars.ts`](https://github.com/eams1798/best-car-deals/blob/main/src/services/cars.ts): Contains the functions to fetch the cars from the different sources.
- [`src/utils/parseLocation.ts`](https://github.com/eams1798/best-car-deals/blob/main/src/utils/parseLocation.ts): Contains the function to parse the location from the Google Maps API response. Useful to give the correct format to the request depending on the source.
- [`src/utils/parseState.ts`](https://github.com/eams1798/best-car-deals/blob/main/src/utils/parseState.ts): Contains the mapping between the state name and the state abbreviation.

### Backend:
- [`src/index.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/index.ts): Entry point of the backend. Starts the server.
- [`src/routes/carRoutes.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/routes/carRoutes.ts): Contains the routes for the app. Description of each route can be found in this file.
- [`src/services/carService.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/services/carService.ts): Contains the functions to fetch the cars from the different sources and merge and sort them in a single list.
- [`src/services/aiService.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/services/aiService.ts): Contains the function to get the tips from Claude AI.
- [`src/utils/AnthropicClient.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/AnthropicClient.ts): Starts the Claude AI client.
- [`src/utils/cleanObject.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/cleanObject.ts): Contains the function to clean the object from the null or undefined values.
- [`src/utils/clFiltersParser.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/clFiltersParser.ts) and [`src/utils/fbFiltersParser.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/fbFiltersParser.ts): Contains the functions to convert the default filters to the format required by the Craigslist and Facebook filters.
- [`src/utils/craigslistScraper.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/craigslistScraper.ts) and [`src/utils/facebookScraper.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/facebookScraper.ts): Contains the functions to scrape the Craigslist and Facebook car elements.
- [`src/utils/CLCarItemScraper.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/CLCarItemScraper.ts) and [`src/utils/FBCarItemScraper.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/FBCarItemScraper.ts): Contains the functions to individually scrape the selected Craigslist or Facebook car.
- [`src/utils/stateMap.ts`](https://github.com/eams1798/best-car-deals_backend/blob/main/src/utils/stateMap.ts): Contains the mapping between the state name and the state abbreviation.
- `src/interfaces` folder: Contains the interfaces for the backend.

## Installation

To install the project, follow these steps:

1. Clone the repositories:
```
git clone https://github.com/eams1798/best-car-deals
git clone https://github.com/eams1798/best-car-deals_backend
```

2. Install the dependencies. I recommend using `yarn`:
```
cd best-car-deals
yarn install
```
```
cd ../best-car-deals_backend
yarn install
yarn playwright install
yarn playwright install-deps chromium
```
3. Create a Google Cloud account, start a new project and get a Maps API key. You can follow the steps listed [here](https://developers.google.com/maps/documentation/javascript/places). You will need a Billing account to use all the Google APIs.
4. Now go to [https://ai.google.dev/](https://ai.google.dev/) and follow the steps to get a new API key for Gemini.
5. On the root of the backend directory, create a .env file with the following variable:
```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
6. On the root of the frontend directory, create a .env file with the following variable:
```
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```
7. Use `yarn dev` on each directory if you want to run them locally, or `yarn start` if you want to run them on production mode.

## How to use the app (click on the images to open the video)
1. Using the main page to start searching for cars with basic filters.

[![Main page](https://github.com/eams1798/projects-resources/blob/main/best_car_deals_README/thumbnail1.png)](https://drive.google.com/file/d/1TFWGEmUjUASqgrVvfcE1rSmXMEhc9tj3/view?usp=drive_link)


2. Clicking on a car to view all the information about the car, and using the AI feature for tips.

[![Car info](https://github.com/eams1798/projects-resources/blob/main/best_car_deals_README/thumbnail2.png)](https://drive.google.com/file/d/1ejD8-sTeXiNEUOxPgKjt4v_ZNB6EUdvf/view?usp=drive_link)

3. Using the sort controls and the reverse checkbox.

[![Sort controls](https://github.com/eams1798/projects-resources/blob/main/best_car_deals_README/thumbnail3.png)](https://drive.google.com/file/d/1UaTDZeqQgXkjsQqpJvKySmlYR9I_U7dg/view?usp=drive_link)
[![Reverse checkbox](https://github.com/eams1798/projects-resources/blob/main/best_car_deals_README/thumbnail4.png)](https://drive.google.com/file/d/1jrfI5M9WE7HKAmDJRRzH7tlR1DZbmoUC/view?usp=drive_link)

4. Using the filters sidebar.

[![Filters sidebar 1](https://github.com/eams1798/projects-resources/blob/main/best_car_deals_README/thumbnail5.png)](https://drive.google.com/file/d/1EJVej4Z9wwkei6l06rweX1kO99UL9AMR/view?usp=drive_link)
[![Filters sidebar 2](https://github.com/eams1798/projects-resources/blob/main/best_car_deals_README/thumbnail6.png)](https://drive.google.com/file/d/1_RvtVHqdjCE5UV2nr81E1R0TqLx9B6nV/view?usp=drive_link)


## Deployment
On each repo, there is another branch called "production". You can use those versions to deploy the app. Just change the script `deploy` on each `package.json` file, rewriting the user `root` and server IP address `185.28.22.245` by one that you own, then run `yarn deploy` on each repo.

## Current issues
Unfortunately, there are some problems while scraping data from Facebook when doing it on production due to Meta restrictions. So, the production app will only work with Craigslist scraper. You can still use it without this restriction on development mode. I'll change the Facebook scraper service soon.