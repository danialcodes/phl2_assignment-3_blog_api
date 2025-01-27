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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordChangeAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isExists = function (id) {
    return this.findById({ _id: id });
};
userSchema.statics.isExistsByEmail = function (email) {
    return this.findOne({ email }).select('+password');
};
userSchema.statics.blockUser = function (id) {
    return this.findByIdAndUpdate({ _id: id }, {
        isBlocked: true,
    });
};
userSchema.statics.unblockUser = function (id) {
    return this.findByIdAndUpdate({ _id: id }, {
        isBlocked: false,
    });
};
userSchema.statics.hashThePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    });
};
userSchema.statics.isPasswordMatched = function (planePassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(planePassword, hashedPassword);
    });
};
userSchema.statics.isJWTExpired = function (jwtIssuedTimestamp, passwordChangeAt) {
    const passwordChangeAtTimeStamp = new Date(passwordChangeAt).getTime() / 1000;
    if (jwtIssuedTimestamp < passwordChangeAtTimeStamp) {
        return true;
    }
};
exports.User = (0, mongoose_1.model)('User', userSchema);
