import { NextResponse } from "next/server";
import db from "@/lib/db"; // your Sequelize instance
import SurveyType from "@/models/SurveyType"; // your model

export async function GET() {
  try {
    await db.authenticate(); // test connection
    const count = await SurveyType.count();

    return NextResponse.json({ message: "DB OK", count });
  } catch (err) {
    console.error("DB connection error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
