"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
exports.user = pg_1.sequelize.define('user', {
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
    phoneNumber: sequelize_1.DataTypes.STRING(15),
    imageUrl: sequelize_1.DataTypes.STRING,
    imageName: sequelize_1.DataTypes.STRING,
    token: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    type_idUsertype: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            key: 'userTypes',
            model: 'idUsertype',
        },
    },
    address_idAddress: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            key: 'address',
            model: 'idAddress',
        },
    },
}, {
    tableName: 'user',
    freezeTableName: true,
    timestamps: false,
});
