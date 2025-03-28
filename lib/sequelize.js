import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

let sequelize;

if (!global.sequelize) {
  global.sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASS,
    {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      dialect: "mysql",
      dialectModule: mysql2,
      dialectOptions: {
        ssl: { require: true },
      },
      logging: false,
    }
  );
}

sequelize = global.sequelize;
export default sequelize;
