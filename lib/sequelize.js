// lib/sequelize.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql', // Make sure mysql is specified
  logging: false, // Optional: disables logging
  dialectModule: require('mysql2'),
  dialectOptions: {

  },
});

export default sequelize;
