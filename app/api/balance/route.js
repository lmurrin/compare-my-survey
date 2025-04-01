import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from "next/server";
import { Surveyor } from "@/models";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If admin, optionally allow query param to get another user's balance (optional)
    const url = new URL(req.url);
    const targetId = url.searchParams.get("surveyorId");

    // Only admin can query other users' balances
    const targetSurveyorId = session.isAdmin && targetId ? targetId : session.id;

    const surveyor = await Surveyor.findByPk(targetSurveyorId, {
      attributes: ["id", "companyName", "balance"],
    });

    if (!surveyor) {
      return NextResponse.json({ error: "Surveyor not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        surveyorId: surveyor.id,
        companyName: surveyor.companyName,
        balance: parseFloat(surveyor.balance).toFixed(2),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}
