"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const parish = pg_1.sequelize.define('parish', {
    idParish: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    parishName: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(100),
    },
}, {
    tableName: 'parish',
    freezeTableName: true,
    timestamps: true,
});
exports.default = parish;
