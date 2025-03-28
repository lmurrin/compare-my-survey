// app/compare/page.js

import React, { Suspense } from "react";
import CompareClient from "./CompareClient";

export default function ComparePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompareClient />
    </Suspense>
  );
}
