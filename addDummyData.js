import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import {
  Surveyor,
  SurveyType,
  Location,
  LocationBasket,
  SurveyorService,
  Quote,
} from "./models/index.js";
import connectDb from "./lib/db.js";

console.log(
  "MongoDB URI:",
  "mongodb+srv://lmurr248:020387Fern@cms.ymscc.mongodb.net/"
);

const addDummyData = async () => {
  try {
    await connectDb(); // Connect to the MongoDB database

    // Create SurveyTypes if not already existing
    const surveyTypes = await Promise.all([
      SurveyType.findOneAndUpdate(
        { name: "Building Survey" },
        { name: "Building Survey" },
        { upsert: true, new: true }
      ),
      SurveyType.findOneAndUpdate(
        { name: "Energy Performance Certificate" },
        { name: "Energy Performance Certificate" },
        { upsert: true, new: true }
      ),
      SurveyType.findOneAndUpdate(
        { name: "Property Valuation" },
        { name: "Property Valuation" },
        { upsert: true, new: true }
      ),
    ]);

    // Create Locations if not already existing
    const locations = await Promise.all([
      Location.findOneAndUpdate(
        { name: "London" },
        { name: "London" },
        { upsert: true, new: true }
      ),
      Location.findOneAndUpdate(
        { name: "Manchester" },
        { name: "Manchester" },
        { upsert: true, new: true }
      ),
      Location.findOneAndUpdate(
        { name: "Bristol" },
        { name: "Bristol" },
        { upsert: true, new: true }
      ),
    ]);

    // Create Surveyors if not already existing
    const surveyors = await Promise.all([
      Surveyor.findOneAndUpdate(
        { companyName: "Surveyors Ltd" },
        {
          companyName: "Surveyors Ltd",
          email: "contact@surveyors.com",
          address: "123 Surveyor Lane, London, UK",
          phone: "0123456789",
          description: "We offer a range of surveyor services.",
          balance: 100.0,
        },
        { upsert: true, new: true }
      ),
      Surveyor.findOneAndUpdate(
        { companyName: "Valuations Inc." },
        {
          companyName: "Valuations Inc.",
          email: "contact@valuations.com",
          address: "456 Valuation St, Manchester, UK",
          phone: "0987654321",
          description: "Expert valuation services.",
          balance: 200.0,
        },
        { upsert: true, new: true }
      ),
    ]);

    // Create LocationBaskets and associate Locations with them
    const locationBaskets = await Promise.all([
      LocationBasket.findOneAndUpdate(
        { name: "London Area Basket" },
        {
          name: "London Area Basket",
          surveyorId: surveyors[0]._id,
          locations: [locations[0]._id, locations[1]._id],
        }, // Adding locations
        { upsert: true, new: true }
      ),
      LocationBasket.findOneAndUpdate(
        { name: "Manchester Area Basket" },
        {
          name: "Manchester Area Basket",
          surveyorId: surveyors[1]._id,
          locations: [locations[1]._id, locations[2]._id],
        }, // Adding locations
        { upsert: true, new: true }
      ),
    ]);

    // Create SurveyorServices and associate Surveyor, SurveyType, LocationBasket
    const surveyorServices = await Promise.all([
      SurveyorService.findOneAndUpdate(
        {
          surveyorId: surveyors[0]._id,
          surveyTypeId: surveyTypes[0]._id,
          locationBasketId: locationBaskets[0]._id,
        },
        {
          surveyorId: surveyors[0]._id,
          surveyTypeId: surveyTypes[0]._id,
          locationBasketId: locationBaskets[0]._id,
          quotes: [
            { propertyMinValue: 50000, propertyMaxValue: 200000, price: 1000 },
          ],
        },
        { upsert: true, new: true }
      ),
      SurveyorService.findOneAndUpdate(
        {
          surveyorId: surveyors[1]._id,
          surveyTypeId: surveyTypes[2]._id,
          locationBasketId: locationBaskets[1]._id,
        },
        {
          surveyorId: surveyors[1]._id,
          surveyTypeId: surveyTypes[2]._id,
          locationBasketId: locationBaskets[1]._id,
          quotes: [
            { propertyMinValue: 100000, propertyMaxValue: 500000, price: 1500 },
          ],
        },
        { upsert: true, new: true }
      ),
    ]);

    // Insert Quotes for each SurveyorService
    const quotes = await Promise.all([
      Quote.findOneAndUpdate(
        { surveyorServiceId: surveyorServices[0]._id },
        {
          surveyorServiceId: surveyorServices[0]._id,
          propertyMinValue: 50000,
          propertyMaxValue: 200000,
          price: 1000,
        },
        { upsert: true, new: true }
      ),
      Quote.findOneAndUpdate(
        { surveyorServiceId: surveyorServices[1]._id },
        {
          surveyorServiceId: surveyorServices[1]._id,
          propertyMinValue: 100000,
          propertyMaxValue: 500000,
          price: 1500,
        },
        { upsert: true, new: true }
      ),
    ]);

    // Log success
    console.log("Dummy data added successfully!");
  } catch (error) {
    console.error("Error adding dummy data:", error);
  } finally {
    mongoose.disconnect(); // Disconnect from MongoDB
  }
};

addDummyData();
