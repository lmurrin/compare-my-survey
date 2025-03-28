import { NextResponse } from "next/server";
import db from "@/lib/db";
import { QueryTypes } from "sequelize";

// GET service by ID
export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Fetch service details
    const serviceResults = await db.query(
      `SELECT 
        ss.id AS id,
        ss.surveyorId,
        ss.surveyTypeId,
        ss.locationBasketId,
        ss.active,
        st.name AS surveyType,
        lb.name AS locationBasket
      FROM surveyor_services ss
      LEFT JOIN survey_types st ON ss.surveyTypeId = st.id
      LEFT JOIN location_baskets lb ON ss.locationBasketId = lb.id
      WHERE ss.id = ?
      LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );

    if (!serviceResults.length) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const service = serviceResults[0];

    // Fetch related quotes
    const quoteResults = await db.query(
      `SELECT id, propertyMinValue, propertyMaxValue, price
       FROM quotes
       WHERE surveyorServiceId = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );

    service.quotes = quoteResults;

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Error fetching service" },
      { status: 500 }
    );
  }
}

// PUT: update locationBasketId, active, and replace quotes
export async function PUT(req, { params }) {
  const { id } = params;
  const { locationBasketId, active, quotes } = await req.json();

  if (!locationBasketId || typeof active === "undefined") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Update service metadata
    await db.query(
      `UPDATE surveyor_services 
       SET locationBasketId = ?, active = ? 
       WHERE id = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [locationBasketId, active ? 1 : 0, id],
      }
    );

    // Delete existing quotes
    await db.query(`DELETE FROM quotes WHERE surveyorServiceId = ?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });

    // Insert new quotes
    for (const quote of quotes) {
      const { propertyMinValue, propertyMaxValue, price } = quote;

      // Basic validation
      if (
        typeof propertyMinValue !== "number" ||
        typeof propertyMaxValue !== "number" ||
        typeof price !== "number"
      ) {
        continue;
      }

      await db.query(
        `INSERT INTO quotes (propertyMinValue, propertyMaxValue, price, surveyorServiceId)
         VALUES (?, ?, ?, ?)`,
        {
          type: QueryTypes.INSERT,
          replacements: [propertyMinValue, propertyMaxValue, price, id],
        }
      );
    }

    return NextResponse.json(
      { message: "Service updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Error updating service" },
      { status: 500 }
    );
  }
}
