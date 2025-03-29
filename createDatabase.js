const mysql = require("mysql2/promise");
const dotenv = async function createSurveyorDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  });

  try {
    // Create the database
    await connection.query(`CREATE DATABASE IF NOT EXISTS [ENTER DATABASE NAME]`); // ENTER DATABASE NAME
    await connection.query(`USE [ENTER DATABASE NAME]`); // ENTER DATABASE NAME

    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`location_basket_locations\` (
      \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`locationBasketId\` int NOT NULL,
        \`locationId\` int NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`location_baskets\` (
      \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`createdAt\` datetime,
        \`name\` varchar(255) NOT NULL,
        \`surveyorId\` int NOT NULL,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`locations\` (
      \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`createdAt\` datetime,
        \`name\` varchar(255) NOT NULL,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`quotes\` (
      \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`createdAt\` datetime,
        \`price\` decimal NOT NULL,
        \`propertyMaxValue\` int NOT NULL,
        \`propertyMinValue\` int NOT NULL,
        \`surveyorServiceId\` int NOT NULL,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`survey_types\` (
      \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`createdAt\` datetime,
        \`name\` varchar(255) NOT NULL,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`surveyor_services\` (
      \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`active\` tinyint DEFAULT '0.0',
        \`createdAt\` datetime,
        \`locationBasketId\` int,
        \`surveyorId\` int,
        \`surveyTypeId\` int,
        \`updatedAt\` datetime
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`surveyors\` (
        \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`addressLine1\` varchar(255),
        \`city\` varchar(255),
        \`companyName\` varchar(255),
        \`createdAt\` datetime,
        \`email\` varchar(255),
        \`phone\` varchar(255),
        \`postcode\` varchar(255),
        \`stripeCustomerId\` varchar(255),
        \`stripeSubscriptionId\` varchar(255),
        \`subscriptionPackage\` varchar(255),
        \`updatedAt\` datetime
      );
    `);

    console.log("Database and tables created successfully.");
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await connection.end();
  }
};

createSurveyorDatabase();
