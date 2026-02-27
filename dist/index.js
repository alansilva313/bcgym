"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const routes_1 = __importDefault(require("./routes"));
require("./models");
const seed_1 = require("./utils/seed");
const translate_1 = require("./utils/translate");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
app.use('/api', routes_1.default);
// Main route
app.get('/', (req, res) => {
    res.json({ message: 'Gym App API - Status: Active' });
});
// Database Sync
database_1.sequelize.sync({ alter: true }).then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Database connected and synchronized.');
    yield (0, seed_1.seedExercises)(); // Seed the database
    yield (0, translate_1.translateExistingExercises)(); // Localize existing records
    // Start listening only if NOT running on Vercel
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
})).catch(err => {
    console.error('Error synchronizing database:', err);
});
exports.default = app;
