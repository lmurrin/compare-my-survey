import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { QueryTypes } from 'sequelize';

export async function GET(req, { params }) {
  try {
    
    const surveyorId = params.surveyorId;

    if (!surveyorId) {
      return NextResponse.json({ error: 'Missing surveyorId' }, { status: 400 });
    }


    const rawResults = await db.query(
      `SELECT 
          ss.id AS serviceId,
          ss.surveyorId,
          ss.surveyTypeId,
          ss.locationBasketId,
          ss.active,
          st.name AS surveyType, 
          lb.name AS locationBasket,
          l.id AS locationId,
          l.name AS locationName,
          s.companyName,
          q.id AS quoteId,
          q.propertyMinValue,
          q.propertyMaxValue,
          q.price
        FROM surveyor_services ss
        LEFT JOIN survey_types st ON ss.surveyTypeId = st.id
        LEFT JOIN location_baskets lb ON ss.locationBasketId = lb.id
        LEFT JOIN location_basket_locations lbl ON lbl.locationBasketId = lb.id
        LEFT JOIN locations l ON l.id = lbl.locationId
        LEFT JOIN surveyors s ON s.id = ss.surveyorId
        LEFT JOIN quotes q ON q.surveyorServiceId = ss.id
        WHERE ss.surveyorId = ?
        `,
      {
        type: QueryTypes.SELECT,
        replacements: [surveyorId],
      }
    );

    // Grouping logic
    const grouped = rawResults.reduce((acc, row) => {
      let existing = acc.find(item => item.id === row.serviceId);

      const location = row.locationId ? { id: row.locationId, name: row.locationName } : null;
      const quote = row.quoteId ? {
        id: row.quoteId,
        propertyMinValue: row.propertyMinValue,
        propertyMaxValue: row.propertyMaxValue,
        price: row.price
      } : null;

      if (!existing) {
        existing = {
          id: row.serviceId,
          surveyorId: row.surveyorId,
          surveyTypeId: row.surveyTypeId,
          active: row.active,
          locationBasketId: row.locationBasketId,
          surveyType: row.surveyType,
          locationBasket: row.locationBasket,
          companyName: row.companyName,
          locations: location ? [location] : [],
          quotes: quote ? [quote] : [],
        };
        acc.push(existing);
      } else {
        if (location && !existing.locations.find(loc => loc.id === location.id)) {
          existing.locations.push(location);
        }
        if (quote && !existing.quotes.find(q => q.id === quote.id)) {
          existing.quotes.push(quote);
        }
      }

      return acc;
    }, []);

    // Sort quotes by propertyMinValue
    grouped.forEach(service => {
      service.quotes.sort((a, b) => a.propertyMinValue - b.propertyMinValue);
    });

    return NextResponse.json(grouped, { status: 200 });

  } catch (error) {
    console.error("Error fetching surveyor services:", error);
    return NextResponse.json({ error: 'Error fetching surveyor services' }, { status: 500 });
  }
}
