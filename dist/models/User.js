"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const Animal_1 = __importDefault(require("./Animal"));
const users = pg_1.sequelize.define('users', {
    idUser: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    givenName: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(60),
    },
    familyName: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(60),
    },
    email: {
        unique: true,
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(255),
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    phoneNumber: sequelize_1.DataTypes.STRING(15),
    imageUrl: sequelize_1.DataTypes.STRING,
    imageName: sequelize_1.DataTypes.STRING,
    status: sequelize_1.DataTypes.STRING(100),
}, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: true,
});
users.hasMany(Animal_1.default);
Animal_1.default.belongsTo(users);
exports.default = users;
