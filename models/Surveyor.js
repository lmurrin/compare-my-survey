// models/Surveyor.js
import { DataTypes } from 'sequelize';
import sequelize from '@/lib/sequelize';


const Surveyor = sequelize.define('Surveyor', {
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
});

export default Surveyor;
