"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
server.use(express_1.default.urlencoded({ extended: true }));
server.use('/api', index_1.default);
server.use((req, res) => {
    res.status(404).send({ message: 'Route not found.' });
});
server.use((0, express_rate_limit_1.default)({
    windowMs: 600000,
    max: 80,
    message: 'You are doing so many requests from the same IP, try again in 10 minutos.',
    headers: true,
}));
dotenv_1.default.config();
server.listen(process.env.PORT);
console.log(` 🚀 Server running at http://localhost:${process.env.PORT}/api/ 🚀 `);
