import { EAutoTransmission, EAutoDriveTrain, EAutoCylinders, ECondition, ELanguage, E_RVType, EAutoPaint, EAutoTitleStatus, EAutoFuelType, EAutoBodyType } from "./craigslistTypes"
import { FBTopLevelVehicleType, FBCarType, FBSellerType, ECarfaxHistory, FBSortBy, FBCondition } from "./facebookTypes"

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  bodyType: string;
  interiorColor: string;
  exteriorColor: string;
  price: number;
  source: 'Facebook' | 'Craigslist' | 'Ebay';
  image: string;
  mileage: number;
  transmission: string;
  fuelType: string;
  description: string;
  deliveryMethod: string;
  titleStatus: string;
  location: string;
  features: string[];
}

export interface DefaultCarFilters {
  source: 'Facebook' | 'Craigslist'; /*done*/
  location: string; /*done*/
  distance?: number; /*done*/
  sort?: string /*done*/
  sellerType?: string; /*done*/
  vehicleType?: string; /*done*/
  bodyType?: string; /*done*/
  minPrice?: number; /*done*/
  maxPrice?: number; /*done*/
  color?: string;
  condition?: string;
  transmissionType?: string; /*done*/
  make?: string; /*done*/
  model?: string; /*done*/
  minYear?: number; /*done*/
  maxYear?: number; /*done*/
  minMileage?: number; /*done*/
  maxMileage?: number; /*done*/
}

export interface FBCarFilters {
  distance?: number; /*done*/
  topLevelVehicleType?: FBTopLevelVehicleType; /*done*/
  carType?: FBCarType[]; /*done*/
  sellerType?: FBSellerType; /*done*/
  minPrice?: number; /*done*/
  maxPrice?: number; /*done*/
  deliveryMethod?: string;
  itemCondition?: FBCondition[]; /*done*/
  make?: string; /*done*/
  model?: string; /*done*/
  minYear?: number; /*done*/
  maxYear?: number; /*done*/
  minMileage?: number; /*done*/
  interiorColor?: string;
  exteriorColor?: string; /*done*/
  maxMileage?: number; /*done*/
  transmissionType?: string; /*done*/
  carFaxHistory?: ECarfaxHistory[];
  sortBy?: FBSortBy /*done*/
}

export interface FoundCar {
  url: string;
  img?: string;
  title: string;
  oldPrice?: number;
  newPrice: number;
  monthlyPayment?: number;
  location?: string;
  mileage: number;
}

export interface CraigslistFiters {
  vehicleType?: "cars" | "trucks" | "rv-campers"; /*done*/
  purveyor?: "owner" | "dealer", /*done*/
  bundleDuplicates?: 0 | 1;
  postedToday?: 0 | 1;
  hasPic?: 0 | 1;
  srchType?: "T";
  search_distance?: number; /*done*/
  postal?: string;
  min_price?: number; /*done*/
  max_price?: number; /*done*/
  min_monthly_payment?: number;
  max_monthly_payment?: number;
  auto_make_model?: string; /*done*/
  min_auto_miles?: number; /*done*/
  max_auto_miles?: number; /*done*/
  min_auto_year?: number; /*done*/
  max_auto_year?: number; /*done*/
  auto_transmission?: EAutoTransmission; /*done*/
  auto_drivetrain?: EAutoDriveTrain;
  auto_cylinders?: EAutoCylinders;
  condition?: ECondition[]; /*done*/
  auto_fuel_type?: EAutoFuelType;
  auto_paint?: EAutoPaint; /*done*/
  auto_title_status?: EAutoTitleStatus;
  language?: ELanguage;
  sort?: "date" | "dateoldest" | "priceasc" | "pricedsc"; /*done*/
}

export interface CLCarFilters extends CraigslistFiters {
  auto_bodytype?: EAutoBodyType[]; /*done*/
}

export interface CLRVFilters extends CraigslistFiters {
  rv_type?: E_RVType[]; /*done*/
}
