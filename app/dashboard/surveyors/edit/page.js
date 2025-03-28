import { Suspense } from "react";
import EditSurveyorForm from "./EditSurveyorForm";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditSurveyorForm />
    </Suspense>
  );
}
