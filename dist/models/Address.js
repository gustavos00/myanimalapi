"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.address = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
exports.address = pg_1.sequelize.define('address', {
    idAddress: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    doorNumber: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(10),
    },
    postalCode: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(12),
    },
    streetName: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(100),
    },
    parish_idParish: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            key: 'parish',
            model: 'idLocality',
        },
    },
}, {
    tableName: 'address',
    freezeTableName: true,
    timestamps: false,
});
