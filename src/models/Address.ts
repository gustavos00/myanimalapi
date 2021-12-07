import { locality } from './Locality';
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/pg'
import users from './User';
import parish from './Parish';

export interface AddressInstance extends Model {
  idAddress: number

  doorNumber: string
  postalCode: string
  streetName: string

  parish_idParish: number
}

const address = sequelize.define<AddressInstance>(
  'address',
  {
    idAddress: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    doorNumber: {
      allowNull: false,
      type: DataTypes.STRING(10),
    },
    postalCode: {
      allowNull: false,
      type: DataTypes.STRING(12),
    },
    streetName: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: 'address',
    freezeTableName: true,
    timestamps: false,
  }
)

address.hasMany(parish)
parish.belongsTo(address)

export default address