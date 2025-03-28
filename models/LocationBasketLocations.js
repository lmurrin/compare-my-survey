import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

const LocationBasketLocations = sequelize.define(
  "LocationBasketLocations",
  {
    locationBasketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "location_baskets",
        key: "id",
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "locations",
        key: "id",
      },
    },
  },
  {
    tableName: "location_basket_locations",
    timestamps: false,
  }
);

export default LocationBasketLocations;
