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
exports.AcademicSemester = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicSemester_const_1 = require("./academicSemester.const");
const academicSemesterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        enum: academicSemester_const_1.AcademicSemesterName,
        required: true,
        immutable: true,
    },
    code: {
        type: String,
        enum: academicSemester_const_1.AcademicSemesterCode,
        required: true,
        immutable: true,
    },
    year: {
        type: String,
        required: true,
        immutable: true,
    },
    startMonth: {
        type: String,
        enum: academicSemester_const_1.AcademicSemesterMonths,
        required: true,
    },
    endMonth: {
        type: String,
        enum: academicSemester_const_1.AcademicSemesterMonths,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});
academicSemesterSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isSemesterExists = yield exports.AcademicSemester.findOne({ name: this.name, year: this.year });
        if (isSemesterExists) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Academic Semester already exists");
        }
        next();
    });
});
academicSemesterSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = this.getQuery();
        const isSemesterExists = yield exports.AcademicSemester.findOne(query);
        if (!isSemesterExists) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Academic Semester does not exists");
        }
        next();
    });
});
academicSemesterSchema.static('isExists', function isExists(id) {
    return this.findById(id);
});
exports.AcademicSemester = (0, mongoose_1.model)('AcademicSemester', academicSemesterSchema);
