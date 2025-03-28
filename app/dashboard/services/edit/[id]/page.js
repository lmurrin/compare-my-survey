// app/dashboard/surveyors/edit/page.js
import React, { Suspense } from "react";
import EditSurveyorClient from "./EditSurveyorClient";

export const dynamic = "force-dynamic";

export default function EditSurveyorPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditSurveyorClient />
    </Suspense>
  );
}
