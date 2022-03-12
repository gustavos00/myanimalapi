import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/pg';

import animal from './Animal';
import classification from './Classification';
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
  isVeterinarian: boolean,

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
    isVeterinarian: DataTypes.BOOLEAN,
  },
  {
    tableName: 'users',
    freezeTableName: true,
    timestamps: true,
  }
);

users.hasMany(animal);
animal.belongsTo(users);

users.hasMany(animal, {
  foreignKey: 'userIdVeterinarian',
  as: 'userVeterinarianFk',
});
animal.belongsTo(users, {
  foreignKey: 'userIdVeterinarian',
  as: 'userVeterinarianFk',
});

users.hasMany(friends, {
  foreignKey: 'userFriendsIdFromWho',
  as: 'userFriendsIdFromWhoFk',
});
friends.belongsTo(users, {
  foreignKey: 'userFriendsIdFromWho',
  as: 'userFriendsIdFromWhoFk',
});

users.hasMany(friends, {
  foreignKey: 'userFriendsIdToWho',
  as: 'userFriendsIdtoWhoFk',
});
friends.belongsTo(users, {
  foreignKey: 'userFriendsIdToWho',
  as: 'userFriendsIdtoWhoFk',
});

users.hasMany(classification, {
  foreignKey: 'userClassificationFromUser',
  as: 'userClassificationFromUserFk',
});
classification.belongsTo(users, {
  foreignKey: 'userClassificationFromUser',
  as: 'userClassificationFromUserFk',
});

users.hasMany(classification, {
  foreignKey: 'userClassificationToUser',
  as: 'userClassificationToUserFk',
});
classification.belongsTo(users, {
  foreignKey: 'userClassificationToUser',
  as: 'userClassificationToUserFk',
});

export default users;
