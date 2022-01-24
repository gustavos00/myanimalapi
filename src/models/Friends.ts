import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';
import { UsersInstance } from './User';

export interface FriendsInstance extends Model {
  idFriends: number;
  status: string;
  fromWhoFk: UsersInstance;
  toWhomFk: UsersInstance;
  fromWho: number;
  toWhom: number;
}

const friends = sequelize.define<FriendsInstance>(
  'friends',
  {
    idfriends: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    fingerprint: DataTypes.STRING(),

    status: {
      allowNull: false,
      type: DataTypes.STRING(100),
      defaultValue: 'Pending',
    },
  },
  {
    tableName: 'friends',
    freezeTableName: true,
    timestamps: true,
  }
);

export default friends;
