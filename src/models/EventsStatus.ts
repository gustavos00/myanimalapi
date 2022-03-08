
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';
import events from './Events';

export interface EventsStatusInstance extends Model {
  idEventsStatus: number;

  label: string;
  value: string;
}

const eventsStatus = sequelize.define<EventsStatusInstance>(
  'eventsStatus',
  {
    idEventsStatus: {
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
    tableName: 'eventsStatus',
    freezeTableName: true,
    timestamps: true,
  }
);

eventsStatus.hasMany(events)
events.belongsTo(eventsStatus)
  
export default eventsStatus;


