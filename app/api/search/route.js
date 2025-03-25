import { NextResponse } from 'next/server';
import { Op, Sequelize } from 'sequelize';
import { Surveyor, SurveyorService, SurveyType, LocationBasket, Location, Quote } from '@/models';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const surveyType = searchParams.get('surveyType');
    const location = searchParams.get('location');
    const propertyPrice = parseFloat(searchParams.get('propertyPrice'));

    if (!surveyType || !location || isNaN(propertyPrice)) {
      return NextResponse.json({ error: 'surveyType, location, and propertyPrice are required' }, { status: 400 });
    }

    // Query database
    const services = await SurveyorService.findAll({
      include: [
        { model: SurveyType, where: { name: surveyType } },
        {
          model: LocationBasket,
          include: [
            {
              model: Location,
              through: { attributes: [] },
              where: { name: location },
            },
          ],
        },
        {
          model: Quote,
          where: {
            propertyMinValue: { [Op.lte]: propertyPrice },
            propertyMaxValue: { [Op.gte]: propertyPrice },
          },
          required: false,
        },
        {
            model: Surveyor,
            as: 'Surveyor',
            attributes: ['id', 'companyName', 'email', 'address', 'phone', 'description']
          },
      ],
      order: Sequelize.literal('RAND()'), // Randomize results
      limit: 6, // Limit to 6 results
    });

    if (services.length === 0) {
      return NextResponse.json({ message: 'No surveyor services found' }, { status: 404 });
    }

    console.log("First service:", services[0]); // Debugging: Inspect the first service

    // Format the response
    const formattedServices = services.map(service => {
      const quotes = service.Quotes || [];
      const applicableQuote = quotes.find(q =>
        propertyPrice >= q.propertyMinValue && propertyPrice <= q.propertyMaxValue
      );

      return {
        id: service.id,
        surveyType: service.SurveyType ? service.SurveyType.name : null, // Safe access
        locationBasket: service.LocationBasket ? service.LocationBasket.name : null, //Safe access
        applicableQuote: applicableQuote ? {
          id: applicableQuote.id,
          price: applicableQuote.price,
          propertyMinValue: applicableQuote.propertyMinValue,
          propertyMaxValue: applicableQuote.propertyMaxValue,
        } : null,
        surveyor: service.Surveyor ? {
            id: service.Surveyor.id,
            companyName: service.Surveyor.companyName,
            email: service.Surveyor.email,
            address: service.Surveyor.address,
            phone: service.Surveyor.phone,
            description: service.Surveyor.description
          } : null
        
      };
    });

    return NextResponse.json({ services: formattedServices }, { status: 200 });

  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
