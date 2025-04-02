import {
  DataTypes
} from 'sequelize';
import sequelize from '../lib/db.js';

import { Lead } from './Leads.js';
import LeadPrice from './LeadPrice.js';



export const Surveyor = sequelize.define('surveyor', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  companyName: {
      type: DataTypes.STRING,
      allowNull: false
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
  address: {
      type: DataTypes.STRING,
      allowNull: false
  },
  phone: {
      type: DataTypes.STRING,
      allowNull: false
  },
  description: {
      type: DataTypes.TEXT
  },
  balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
  },
  website: {
      type: DataTypes.TEXT,
      allowNull: true,
  },
}, {
  tableName: 'surveyors'
});

export const SurveyType = sequelize.define('survey_type', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
}, {
  tableName: 'survey_types'
});

export const Location = sequelize.define('location', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
}, {
  tableName: 'locations'
});

export const LocationBasket = sequelize.define('location_basket', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  surveyorId: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
}, {
  tableName: 'location_baskets'
});

export const SurveyorService = sequelize.define('surveyor_service', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  surveyorId: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  surveyTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  locationBasketId: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
}, {
  tableName: 'surveyor_services'
});

export const Quote = sequelize.define('quote', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  surveyorServiceId: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  propertyMinValue: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  propertyMaxValue: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
  },
}, {
  tableName: 'quotes'
});


export const LeadSurveyor = sequelize.define('lead_surveyors', {
  leadId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
  },
  surveyorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
  },
  quote: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
  },
  chargeAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
  },
}, {
  tableName: 'lead_surveyors',
  timestamps: true,
});




// Associations

SurveyorService.belongsTo(SurveyType, {
  foreignKey: 'surveyTypeId',
  as: 'survey_type'
});
SurveyorService.belongsTo(LocationBasket, {
  foreignKey: 'locationBasketId',
  as: 'location_basket'
});
SurveyorService.belongsTo(Surveyor, {
  foreignKey: 'surveyorId',
  as: 'surveyor'
});
SurveyorService.hasMany(Quote, {
  foreignKey: 'surveyorServiceId',
  as: 'quotes'
});

Quote.belongsTo(SurveyorService, {
  foreignKey: 'surveyorServiceId'
});




LocationBasket.belongsTo(Surveyor, {
  foreignKey: 'surveyorId'
});
LocationBasket.belongsToMany(Location, {
  through: 'location_basket_locations',
  timestamps: false
});
Location.belongsToMany(LocationBasket, {
  through: 'location_basket_locations',
  timestamps: false
});

// lead model already defines surveyTypeId column
Lead.belongsTo(SurveyType, {
  foreignKey: 'surveyTypeId',
  as: 'survey_type',
});

// many-to-many with surveyors
Lead.belongsToMany(Surveyor, {
  through: {
      model: 'lead_surveyors',
      timestamps: false,
  },
  as: 'surveyors',
  foreignKey: 'leadId',
});

Surveyor.belongsToMany(Lead, {
  through: {
      model: 'lead_surveyors',
      timestamps: false,
  },
  as: 'leads',
  foreignKey: 'surveyorId',
});


export {
  Lead,
  LeadPrice
};


export default sequelize;