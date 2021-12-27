import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/pg'
import users from './User'

export interface UsersTypesInstance extends Model {
  idUsertype: number

  type: string
}

const usersTypes = sequelize.define<UsersTypesInstance>(
  'usersTypes',
  {
    idUsertype: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    type: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: 'usersTypes',
    freezeTableName: true,
    timestamps: true,
  }
)

usersTypes.hasMany(users)
users.belongsTo(usersTypes)

export default usersTypes
