export type FBTopLevelVehicleType = 'car_truck' | 'rv-camper'
export type FBCarType = 'convertible' | 'coupe' | 'hatchback' | 'minivan' | 'wagon' | 'sedan' | 'suv' | 'truck' | 'small_car' | 'other_body_style'
export type FBSellerType = 'dealership' | 'individual'
export type FBSortBy = 'best_match' | 'price_ascend' | 'price_descend' | 'creation_time_descend' | 'creation_time_ascend' | 'distance_ascend' | 'distance_descend' | 'vehicle_mileage_ascend' | 'vehicle_mileage_descend' | 'vehicle_year_descend' | 'vehicle_year_ascend'
export type FBCondition = 'new' | 'used_like_new' | 'used_good' | 'used_fair'

export enum ECarfaxHistory{
  "Includes free CARFAX report",
  "No accidents or damage reported",
  "Only one owner",
  "Personal use",
  "Service records available"
}
