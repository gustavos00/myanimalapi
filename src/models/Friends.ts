import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';

export interface FriendsInstance extends Model {
  idfriends: number;
  status: string;
  userfromWho: number;
  usertoWhom: number;
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
