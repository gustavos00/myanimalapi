"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const Events_1 = __importDefault(require("./Events"));
const eventsTypes = pg_1.sequelize.define('eventsTypes', {
    idEventsTypes: {
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
    tableName: 'eventsTypes',
    freezeTableName: true,
    timestamps: true,
});
eventsTypes.hasMany(Events_1.default);
Events_1.default.belongsTo(eventsTypes);
exports.default = eventsTypes;
