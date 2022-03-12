import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';

import events from './Events';

export interface EventsTypesInstance extends Model {
  idEventsTypes: number;

  label: string;
  value: string;
}

const eventsTypes = sequelize.define<EventsTypesInstance>(
  'eventsTypes',
  {
    idEventsTypes: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    label: {
      allowNull: false,
      type: DataTypes.STRING(150),
    },

    value: {
      allowNull: false,
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: 'eventsTypes',
    freezeTableName: true,
    timestamps: true,
  }
);

eventsTypes.hasMany(events)
events.belongsTo(eventsTypes)
  
export default eventsTypes;


