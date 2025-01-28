"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// default route
app.get('/', (req, res) => {
    res.send("<html><head><title>Bookshop API</title></head><body style='width:100vw;display:flex;justify-content:center;align-items:center'><h1 style='color:green'>Welcome to Blog Api</h1></body></html>");
});
// application routes
app.use('/api', (_req, res, next) => {
    // console.log('----------');
    next();
}, routes_1.default);
// error handling
app.use(globalErrorHandler_1.default);
// not found
app.use(notFound_1.default);
exports.default = app;
