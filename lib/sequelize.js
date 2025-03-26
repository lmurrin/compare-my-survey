// lib/sequelize.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql', // Make sure mysql is specified
  logging: false, // Optional: disables logging
  dialectModule: require('mysql2'),
  dialectOptions: {
    useUTC: true, // If using UTC time
    timezone: 'Etc/GMT+0', // Optional: adjust based on your server timezone
  },
});

export default sequelize;
