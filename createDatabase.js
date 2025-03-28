const mysql = require('mysql2/promise');

async function createSurveyorDatabase() {
  const connection = await mysql.createConnection({
    host: 'laurencemurrin.co.uk',
    user: 'uhf1gnskjpqh7',
    password: 'ValleyView8646*',
    database: 'dbdcranbszswjp',
    port: '3306'
  });

  try {
    // Create the database
    await connection.query(`CREATE DATABASE IF NOT EXISTS dbdcranbszswjp`);
    await connection.query(`USE dbdcranbszswjp`);

    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`location_basket_locations\` (
        \`locationBasketId\` int NOT NULL,
        \`locationId\` int NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`location_baskets\` (
        \`createdAt\` datetime,
        \`id\` int NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`surveyorId\` int NOT NULL,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`locations\` (
        \`createdAt\` datetime,
        \`id\` int NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`quotes\` (
        \`createdAt\` datetime,
        \`id\` int NOT NULL,
        \`price\` decimal NOT NULL,
        \`propertyMaxValue\` int NOT NULL,
        \`propertyMinValue\` int NOT NULL,
        \`surveyorServiceId\` int NOT NULL,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`survey_types\` (
        \`createdAt\` datetime,
        \`id\` int NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`surveyor_services\` (
        \`active\` tinyint DEFAULT '0.0',
        \`createdAt\` datetime,
        \`id\` int NOT NULL,
        \`locationBasketId\` int,
        \`surveyorId\` int,
        \`surveyTypeId\` int,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`surveyors\` (
        \`addressLine1\` varchar(255),
        \`city\` varchar(255),
        \`companyName\` varchar(255),
        \`createdAt\` datetime,
        \`email\` varchar(255),
        \`id\` int NOT NULL,
        \`phone\` varchar(255),
        \`postcode\` varchar(255),
        \`stripeCustomerId\` varchar(255),
        \`stripeSubscriptionId\` varchar(255),
        \`subscriptionPackage\` varchar(255),
        \`updatedAt\` datetime
      );
    `);

    console.log('Database and tables created successfully.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await connection.end();
  }
}

createSurveyorDatabase();
