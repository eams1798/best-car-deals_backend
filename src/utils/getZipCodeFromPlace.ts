interface Place {
  "place name"?: string;
  "longitude"?: string;
  "post code"?: string;
  "latitude"?: string;
}

export const getZipCodeFromPlace = async ({city, state}: {city: string, state: string}): Promise<string> => {
  const response = await fetch(`https://api.zippopotam.us/us/${state}/${city}`);
  const {places}: {places: Place[]} = await response.json();
  
  const selectedPlace = places.find(pl => pl["place name"] === city);

  return selectedPlace?.["post code"] || "00000";
};

(async() => {
  console.log(await getZipCodeFromPlace({city: "North Attleboro", state: "MA"}))
}
)()