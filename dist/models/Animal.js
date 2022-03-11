"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const Events_1 = __importDefault(require("./Events"));
const animal = pg_1.sequelize.define('animal', {
    idAnimal: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(250),
    },
    age: sequelize_1.DataTypes.STRING(5),
    breed: sequelize_1.DataTypes.STRING(250),
    trackNumber: {
        type: sequelize_1.DataTypes.STRING(15),
        unique: true,
    },
    photoName: sequelize_1.DataTypes.STRING,
    photoUrl: sequelize_1.DataTypes.STRING,
    birthday: sequelize_1.DataTypes.STRING(2),
    birthdayMonth: sequelize_1.DataTypes.STRING(2),
    veterinarianChatFingerprint: sequelize_1.DataTypes.STRING()
}, {
    tableName: 'animal',
    freezeTableName: true,
    timestamps: true,
});
animal.hasMany(Events_1.default);
Events_1.default.belongsTo(animal);
exports.default = animal;
