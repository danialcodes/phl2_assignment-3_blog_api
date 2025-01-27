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
exports.AcademicFaculty = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicFacultySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
academicFacultySchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAcademicFacultyExists = yield exports.AcademicFaculty.findOne({ name: this.name });
        if (isAcademicFacultyExists) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Academic Faculty already exists");
        }
        next();
    });
});
academicFacultySchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = this.getQuery();
        const isAcademicFacultyExists = yield exports.AcademicFaculty.findOne(query);
        if (!isAcademicFacultyExists) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Academic faculty does not exists");
        }
        next();
    });
});
academicFacultySchema.static('isExists', function isExists(id) {
    return this.findById(id);
});
exports.AcademicFaculty = (0, mongoose_1.model)('AcademicFaculty', academicFacultySchema);
