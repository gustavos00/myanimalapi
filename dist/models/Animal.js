"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animal = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
exports.animal = pg_1.sequelize.define('animal', {
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
    imageName: sequelize_1.DataTypes.STRING,
    imageUrl: sequelize_1.DataTypes.STRING,
    birthday: sequelize_1.DataTypes.STRING(2),
    birthdayMonth: sequelize_1.DataTypes.STRING(2),
    user_idUser: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            key: 'user',
            model: 'idUser',
        },
    },
}, {
    tableName: 'animal',
    freezeTableName: true,
    timestamps: false,
});
