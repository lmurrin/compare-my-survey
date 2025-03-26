// models/SurveyType.js (example)
import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const Locations = sequelize.define('Location', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'locations', 
});

export default Locations;
