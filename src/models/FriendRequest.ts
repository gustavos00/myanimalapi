import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/pg'

export interface FriendRequestInstance extends Model {
  idAddress: number

  doorNumber: string
  postalCode: string
  streetName: string

  parish_idParish: number
}

const friendRequest = sequelize.define<FriendRequestInstance>(
  'friendRequest',
  {
    idFriendRequest: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    fromWho: {
      allowNull: false,
      type: DataTypes.STRING(10),
    },
    toWhom: {
      allowNull: false,
      type: DataTypes.STRING(10),
    },
  },
  {
    tableName: 'friendRequest',
    freezeTableName: true,
    timestamps: true,
  }
)

export default friendRequest