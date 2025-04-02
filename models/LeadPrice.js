import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const LeadPrice = sequelize.define('lead_price', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  surveyTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'survey_types',
      key: 'id',
    },
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  multiplier: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: 'lead_prices',
  timestamps: false,
});

export default LeadPrice;
