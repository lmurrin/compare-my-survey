import Areas from "./Areas";
import Locations from "./Locations";
import LocationBasketLocations from "./LocationBasketLocations";

let initialized = false;

export function initModels() {
  if (initialized) return;
  initialized = true;

  Areas.belongsToMany(Locations, {
    through: LocationBasketLocations,
    foreignKey: "locationBasketId",
    otherKey: "locationId",
    as: "locations",
  });

  Locations.belongsToMany(Areas, {
    through: LocationBasketLocations,
    foreignKey: "locationId",
    otherKey: "locationBasketId",
    as: "areas",
  });
}

export { Areas, Locations, LocationBasketLocations };
