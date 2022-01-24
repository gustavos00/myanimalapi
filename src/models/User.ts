import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/pg';

import animal from './Animal';
import friends from './Friends';

export interface UsersInstance extends Model {
  idUser: number;

  givenName: string;
  familyName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
  photoName: string;
  token: string;
  expoToken?: string;
  status: string;

  addressIdAddress: number;
}

const users = sequelize.define<UsersInstance>(
  'users',
  {
    idUser: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    givenName: {
      allowNull: false,
      type: DataTypes.STRING(60),
    },
    familyName: {
      allowNull: false,
      type: DataTypes.STRING(60),
    },
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(255),
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
    },
    expoToken: DataTypes.STRING,
    phoneNumber: DataTypes.STRING(15),
    photoUrl: DataTypes.STRING,
    photoName: DataTypes.STRING,
    status: DataTypes.STRING(100),
  },
  {
    tableName: 'users',
    freezeTableName: true,
    timestamps: true,
  }
);

users.hasMany(animal);
animal.belongsTo(users);

users.hasMany(friends, { foreignKey: 'fromWho', as: 'fromWhoFk' });
friends.belongsTo(users, { foreignKey: 'fromWho', as: 'fromWhoFk' });

users.hasMany(friends, { foreignKey: 'toWhom', as: 'toWhomFk' });
friends.belongsTo(users, { foreignKey: 'toWhom', as: 'toWhomFk' });

export default users;
