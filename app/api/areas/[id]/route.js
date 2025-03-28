import { NextResponse } from "next/server";
import { initModels, Areas, Locations } from "@/models/initModels";

initModels(); // ✅ Safe to run globally once at the top

// GET area by ID with locations
export async function GET(req) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    const area = await Areas.findByPk(id, {
      include: [
        {
          model: Locations,
          as: "locations",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!area) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    return NextResponse.json(area, { status: 200 });
  } catch (error) {
    console.error("Error fetching area:", error);
    return NextResponse.json({ error: "Error fetching area" }, { status: 500 });
  }
}

// PUT update area name + locations
export async function PUT(req) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const { name, locationIds } = await req.json();

    if (!name || !Array.isArray(locationIds)) {
      return NextResponse.json(
        { error: "Missing name or locationIds" },
        { status: 400 }
      );
    }

    const area = await Areas.findByPk(id);
    if (!area) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    // Update name
    await area.update({ name });

    // Update location associations
    await area.setLocations(locationIds);

    // Return updated area with locations
    const updatedArea = await Areas.findByPk(id, {
      include: [
        {
          model: Locations,
          as: "locations",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    return NextResponse.json(
      { message: "Area updated", area: updatedArea },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating area:", error);
    return NextResponse.json({ error: "Error updating area" }, { status: 500 });
  }
}

// DELETE area and remove associations
export async function DELETE(req) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    const area = await Areas.findByPk(id);
    if (!area) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    // Optional: remove linked locations before deletion
    await area.setLocations([]);

    await area.destroy();

    return NextResponse.json({ message: "Area deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting area:", error);
    return NextResponse.json({ error: "Error deleting area" }, { status: 500 });
  }
}
