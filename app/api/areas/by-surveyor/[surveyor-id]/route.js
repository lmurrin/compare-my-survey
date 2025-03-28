import { NextResponse } from "next/server";
import { initModels, Areas, Locations } from "@/models/initModels";

export async function GET(req, { params }) {
  try {
    const surveyorId = params["surveyor-id"];

    if (!surveyorId) {
      return NextResponse.json(
        { error: "Missing surveyorId" },
        { status: 400 }
      );
    }

    initModels();

    const areas = await Areas.findAll({
      where: { surveyorId },
      include: [
        {
          model: Locations,
          as: "locations",
          attributes: ["id", "name"],
          through: { attributes: [] }, // exclude join table fields
        },
      ],
    });

    return NextResponse.json(areas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching areas by surveyorId" },
      { status: 500 }
    );
  }
}
