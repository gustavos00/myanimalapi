import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/pg'
import parish from './Parish'

export interface LocalityInstance extends Model {
  idLocality: number

  locationName: string
}

const locality = sequelize.define<LocalityInstance>(
  'locality',
  {
    idLocality: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    locationName: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: 'locality',
    freezeTableName: true,
    timestamps: true,
  }
)

locality.hasMany(parish)
parish.belongsTo(locality)

export default locality