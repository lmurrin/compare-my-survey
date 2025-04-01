
import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

// Lead model
export const Lead = sequelize.define('lead', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surveyTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'survey_types',
      key: 'id',
    },
  },
}, {
  tableName: 'leads',
});
