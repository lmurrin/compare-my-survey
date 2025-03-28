import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/db';

const LocationBasketLocations = sequelize.define('LocationBasketLocations', {
  locationBasketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Areas', // Ensure this is correct
      key: 'id',
    },
    primaryKey: true, // Make this the primary key if you don't want an 'id'
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Locations', // Ensure this is correct
      key: 'id',
    },
  },
}, {
  tableName: 'location_basket_locations',
  timestamps: false,
});


export default LocationBasketLocations;
