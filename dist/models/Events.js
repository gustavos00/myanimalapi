"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const events = pg_1.sequelize.define('events', {
    idEvents: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    report: sequelize_1.DataTypes.STRING,
    date: sequelize_1.DataTypes.DATE,
}, {
    tableName: 'events',
    freezeTableName: true,
    timestamps: true,
});
exports.default = events;
