import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/pg'

export interface ParishInstance extends Model {
  idParish: number

  doorNumber: string
  postalCode: string
  streetName: string

  parish_idParish: number
}

export const parish = sequelize.define<ParishInstance>(
  'parish',
  {
    idParish: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    parishName: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(100),
    },

    location_idLocation: {
      type: DataTypes.INTEGER,
      references: {
        key: 'locality',
        model: 'type',
      },
    },
  },
  {
    tableName: 'parish',
    freezeTableName: true,
    timestamps: false,
  }
)


