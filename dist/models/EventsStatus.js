"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const Events_1 = __importDefault(require("./Events"));
const eventsStatus = pg_1.sequelize.define('eventsStatus', {
    idEventsStatus: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    label: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(150),
    },
    value: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(150),
    },
}, {
    tableName: 'eventsStatus',
    freezeTableName: true,
    timestamps: true,
});
eventsStatus.hasMany(Events_1.default);
Events_1.default.belongsTo(eventsStatus);
exports.default = eventsStatus;
