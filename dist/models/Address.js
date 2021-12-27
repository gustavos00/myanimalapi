"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const User_1 = __importDefault(require("./User"));
const Parish_1 = __importDefault(require("./Parish"));
const address = pg_1.sequelize.define('address', {
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
}, {
    tableName: 'address',
    freezeTableName: true,
    timestamps: true,
});
address.hasMany(User_1.default);
User_1.default.belongsTo(address);
Parish_1.default.hasMany(address);
address.belongsTo(Parish_1.default);
exports.default = address;
