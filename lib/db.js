import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: false,
});

export default sequelize;
