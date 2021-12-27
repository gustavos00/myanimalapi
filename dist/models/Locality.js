"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const Parish_1 = __importDefault(require("./Parish"));
const locality = pg_1.sequelize.define('locality', {
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
    timestamps: true,
});
locality.hasMany(Parish_1.default);
Parish_1.default.belongsTo(locality);
exports.default = locality;
