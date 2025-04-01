import { LeadPrice } from '@/models';

export async function seedLeadPrices() {
  const existingLeadPrices = await LeadPrice.findAll();

  const leadPriceData = [
    {
      surveyTypeId: 1,
      basePrice: 4,
      multiplier: JSON.stringify({ "6": 1.0, "5": 1.18, "4": 1.38, "3": 1.6, "2": 1.8, "1": 2 }),
    },
    {
      surveyTypeId: 2,
      basePrice: 3,
      multiplier: JSON.stringify({ "6": 1.0, "5": 1.18, "4": 1.38, "3": 1.6, "2": 1.8, "1": 2 }),
    },
  ];

  for (const priceData of leadPriceData) {
    const exists = existingLeadPrices.find(p => p.surveyTypeId === priceData.surveyTypeId);
    if (!exists) {
      await LeadPrice.create(priceData);
    }
  }
}
