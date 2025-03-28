import { NextResponse } from 'next/server';
import Areas from '@/models/Areas';
import LocationBasketLocations from '@/models/LocationBasketLocations';

// GET all locations
export async function GET() {
  try {
    // Fetch all areas using Sequelize
    const areas = await Areas.findAll();

    // If no areas are found, return an empty array or a 404 response
    if (areas.length === 0) {
      return NextResponse.json({ message: 'No areas found' }, { status: 404 });
    }

    // Return the list of areas
    return NextResponse.json(areas, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching areas' }, { status: 500 });
  }
}

// POST a new area (location basket)
export async function POST(req) {
  try {
      const { name, locationIds, surveyorId } = await req.json();
      console.log(name, locationIds, surveyorId);
      
      if (!name || !locationIds || locationIds.length === 0 || !surveyorId) {
          return NextResponse.json({ error: 'Missing required fields: name, locationIds, and surveyorId' }, { status: 400 });
      }

      // Create a new area (location basket)
      const newArea = await Areas.create({
          name,
          surveyorId,
      });

      // Map the location basket to selected locations (location_basket_locations)
      const locationBasketMappings = locationIds.map((locationId) => ({
          locationBasketId: newArea.id,
          locationId,
      }));

      console.log(locationIds);
console.log(newArea.id);


      // Create the location_basket_locations records
      await LocationBasketLocations.bulkCreate(locationBasketMappings);

      return NextResponse.json({ message: 'Area created and locations mapped successfully', id: newArea.id }, { status: 201 });
  } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error adding area' }, { status: 500 });
  }
}