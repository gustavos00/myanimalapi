import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';

import events from './Events';

export interface EventsTypesInstance extends Model {
  idEventsTypes: number;

  type: string;
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

    type: {
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


