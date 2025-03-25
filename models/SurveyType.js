// models/SurveyType.js (example)
import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const SurveyType = sequelize.define('SurveyType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'survey_types', 
});

export default SurveyType;
