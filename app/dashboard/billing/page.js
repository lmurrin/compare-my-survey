import { Suspense } from 'react';
import Billing from './Billing';

export default function BillingPage() {
  return (
    <Suspense fallback={<p>Loading billing page...</p>}>
      <Billing />
    </Suspense>
  );
}
