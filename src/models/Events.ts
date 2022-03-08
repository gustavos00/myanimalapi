import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/pg'

export interface EventsInstance extends Model {
  idEvents: number

  date: string,
  eventReport: string,
}

const events = sequelize.define<EventsInstance>(
  'events',
  {
    idEvents: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    eventReport: DataTypes.STRING,
    date: DataTypes.DATE,
  },
  {
    tableName: 'events',
    freezeTableName: true,
    timestamps: true,
  }
)

export default events