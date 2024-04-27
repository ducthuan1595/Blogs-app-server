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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const init_redis_1 = require("./dbs/init.redis");
const init_1 = __importDefault(require("./router/init"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({}));
app.use((0, cookie_parser_1.default)());
// init redis
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, init_redis_1.initRedis)();
    const redisStore = new connect_redis_1.default({
        client: init_redis_1.redisClient
    });
    // save session
    app.use((0, express_session_1.default)({
        secret: 'blog-app',
        resave: false,
        store: redisStore,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 5 * 60 * 1000
        }
    }));
}))();
(0, init_1.default)(app);
//handle error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 500;
    next(error);
});
app.use((err, req, res, next) => {
    res.json({
        status: err.status,
        message: err.message
    });
});
mongoose_1.default.connect((_a = process.env.DATABASE_URL) !== null && _a !== void 0 ? _a : '').then(() => {
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}).catch((err) => console.log(err));
