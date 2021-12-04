"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locality = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
exports.locality = pg_1.sequelize.define('locality', {
    idLocality: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    locationName: {
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING(100),
    },
}, {
    tableName: 'locality',
    freezeTableName: true,
    timestamps: false,
});
