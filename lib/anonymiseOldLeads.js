import { Op } from 'sequelize';
import { Lead } from '../models/index.js';

export async function anonymiseOldLeads() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 10);

  const leads = await Lead.findAll({
    where: {
      createdAt: { [Op.lt]: cutoffDate },
      [Op.or]: [
        { email: { [Op.ne]: 'deleted@example.com' } },
        { lastName: { [Op.ne]: 'Deleted' } },
        { phone: { [Op.ne]: '0000000000' } },
      ],
    },
  });

  for (const lead of leads) {
    lead.email = 'deleted@example.com';
    lead.lastName = 'Deleted';
    lead.phone = '0000000000';
    await lead.save();
  }

  return leads.length;
}
