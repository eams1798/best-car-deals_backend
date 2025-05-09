import { EAutoTransmission, EAutoDriveTrain, EAutoCylinders, ECondition, ELanguage, E_RVType, EAutoPaint, EAutoTitleStatus, EAutoFuelType, EAutoBodyType } from "./craigslistTypes"
import { FBTopLevelVehicleType, FBCarType, FBSellerType, ECarfaxHistory, FBSortBy, FBCondition } from "./facebookTypes"
import { CDCFuelType, CDCDrivetrain, CDCTransmission, CDCBodystyle, CDCSellerType, CDCSortBy } from "./carsDCTypes"

export interface Car {
  url?: string;
  id?: number;
  make?: string;
  model?: string;
  year?: number;
  bodyType?: string;
  interiorColor?: string;
  exteriorColor?: string;
  price?: number;
  monthlyPayment?: number;
  source?: 'Facebook' | 'Craigslist' | 'Cars.com';
  image?: string;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  description?: string;
  deliveryMethod?: string;
  titleStatus?: string;
  location?: string;
  features?: string[];
  owners?: number;
  safetyRate?: string;
  title?: string;
  color?: string;
  MPG?: {
    city?: number;
    highway?: number;
    combined?: number;
  };
  condition?: string;
  meta?: string
}

export interface DefaultCarFilters {
  source?: ('Facebook' | 'Craigslist' | 'Cars.com')[];
  location?: string;
  reversed_sort?: boolean;

  distance?: number;
  sort?: string;
  sellerType?: string;
  vehicleType?: string;
  bodyType?: string[];
  fuelType?: string[];
  rv_type?: string[];
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  condition?: string[];
  transmission?: string;
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
}

export interface CarsDotComFilters {
  zip?: string;
  maximum_distance?: number;
  dealer_id?: number;
  include_shippable?: boolean;
  keyword?: string;
  list_price_max?: number;
  list_price_min?: number;
  "fuel_slugs[]"?: CDCFuelType[] | string[];
  "drivetrain_slugs[]"?: CDCDrivetrain | string;
  "transmission_slugs[]"?: CDCTransmission | string;
  "body_style_slugs[]"?: CDCBodystyle[] | string[];
  "exterior_color_slugs[]"?: string;
  "makes[]"?: string[];
  "models[]"?: string[];
  "seller_type[]"?: CDCSellerType | string;
  mileage_max?: number;
  monthly_payment?: number;
  sort?: CDCSortBy;
  stock_type?: string;
  year_max?: number;
  year_min?: number;
}

export interface FBCarFilters {
  location?: string;
  distance?: number;
  topLevelVehicleType?: FBTopLevelVehicleType;
  carType?: FBCarType[];
  sellerType?: FBSellerType;
  minPrice?: number;
  maxPrice?: number;
  deliveryMethod?: string;
  itemCondition?: FBCondition[];
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  interiorColor?: string;
  exteriorColor?: string;
  transmissionType?: string;
  carFaxHistory?: ECarfaxHistory[];
  sortBy?: FBSortBy
}

export interface FoundCar {
  source: string;
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
  location?: string;
  vehicleType?: "cars" | "trucks" | "rv-campers";
  purveyor?: "owner" | "dealer",
  bundleDuplicates?: 0 | 1;
  postedToday?: 0 | 1;
  hasPic?: 0 | 1;
  srchType?: "T";
  search_distance?: number;
  postal?: string;
  min_price?: number;
  max_price?: number;
  min_monthly_payment?: number;
  max_monthly_payment?: number;
  auto_make_model?: string;
  min_auto_miles?: number;
  max_auto_miles?: number;
  min_auto_year?: number;
  max_auto_year?: number;
  auto_transmission?: EAutoTransmission;
  auto_drivetrain?: EAutoDriveTrain;
  auto_cylinders?: EAutoCylinders;
  condition?: ECondition[];
  auto_fuel_type?: EAutoFuelType;
  auto_paint?: EAutoPaint;
  auto_title_status?: EAutoTitleStatus;
  language?: ELanguage;
  sort?: "date" | "dateoldest" | "priceasc" | "pricedsc";
}

export interface CLCarFilters extends CraigslistFiters {
  auto_bodytype?: EAutoBodyType[];
}

export interface CLRVFilters extends CraigslistFiters {
  rv_type?: E_RVType[];
}
