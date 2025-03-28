import { NextResponse } from "next/server";
import SurveyType from "@/models/SurveyType";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONT_END_URL,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

// GET all survey types
export async function GET() {
  try {
    const surveyTypes = await SurveyType.findAll();

    if (surveyTypes.length === 0) {
      return NextResponse.json(
        { message: "No survey types found" },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(surveyTypes, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching survey types" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// POST a new survey type
export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const newSurveyType = await SurveyType.create({ name });

    return NextResponse.json(
      { message: "Survey type added", id: newSurveyType.id },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error adding survey type" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
