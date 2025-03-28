import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

const Areas = sequelize.define(
  "Area",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surveyorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "location_baskets",
  }
);

export default Areas;
