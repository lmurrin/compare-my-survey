import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

const Locations = sequelize.define(
  "Location",
  
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "locations",
  }
);

export default Locations;
