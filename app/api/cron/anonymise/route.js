// Trigger anonymise leads to delete personal data older than 10 days

import { anonymiseOldLeads } from '@/lib/anonymiseOldLeads';
import { NextResponse } from 'next/server';

export async function GET() {
  const count = await anonymiseOldLeads();
  return NextResponse.json({ message: `Anonymised ${count} leads` });
}
