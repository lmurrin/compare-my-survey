import { Op } from 'sequelize';
import { Lead } from '../models/index.js';

export async function anonymiseOldLeads() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 1);

  const leads = await Lead.findAll({
    where: {
      createdAt: { [Op.lt]: cutoffDate },
      [Op.or]: [
        { email: { [Op.ne]: null } },
        { lastName: { [Op.ne]: null } },
        { phone: { [Op.ne]: null } },
      ],
    },
  });

  for (const lead of leads) {
    lead.email = null;
    lead.lastName = null;
    lead.phone = null;
    await lead.save();
  }

  return leads.length;
}
