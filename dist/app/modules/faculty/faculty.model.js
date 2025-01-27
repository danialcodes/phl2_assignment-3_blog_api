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
exports.Faculty = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const facultySchema = new mongoose_1.Schema({
    name: {
        firstName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required'],
        unique: true,
    },
    id: { type: String, required: true, unique: true },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    contractNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true,
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    profileImage: { type: String },
    isDeleted: { type: Boolean, default: false },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
        required: [true, 'Academic Department id is required'],
    },
}, {
    timestamps: true,
    versionKey: false,
});
facultySchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const faculty = yield exports.Faculty.isExists(this.getQuery()._id);
        const updateData = this.getUpdate();
        if (!faculty) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Faculty not found");
        }
        else if ('id' in updateData) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Id can't be updated");
        }
        next();
    });
});
facultySchema.static('isExists', function isExists(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existsUser = exports.Faculty.findById(id);
        return existsUser;
    });
});
exports.Faculty = (0, mongoose_1.model)('Faculty', facultySchema);
