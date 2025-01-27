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
exports.AcademicSemesterServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicSemester_const_1 = require("./academicSemester.const");
const academicSemester_model_1 = require("./academicSemester.model");
const createAcademicSemesterIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (academicSemester_const_1.AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Invalid semester code");
    }
    const newSemester = yield academicSemester_model_1.AcademicSemester.create(payload);
    return newSemester;
});
const getAcademicSemestersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const semesters = yield academicSemester_model_1.AcademicSemester.find({});
    return semesters;
});
const getSingleAcademicSemesterFromDB = (semesterId) => __awaiter(void 0, void 0, void 0, function* () {
    const semester = yield academicSemester_model_1.AcademicSemester.findById(semesterId);
    return semester;
});
const updateSingleAcademicSemesterIntoDB = (semesterId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedSemester = yield academicSemester_model_1.AcademicSemester.isExists(semesterId);
    if (!requestedSemester) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Semester not found');
    }
    if (payload.name && !payload.code) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Cannot update semester name without semester code');
    }
    else if (payload.code && !payload.name) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Cannot update semester code without semester name');
    }
    else if (payload.name && payload.code && academicSemester_const_1.AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Invalid semester code");
    }
    const result = yield academicSemester_model_1.AcademicSemester.findOneAndUpdate({ _id: semesterId }, payload, {
        new: true,
    });
    return result;
});
exports.AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAcademicSemestersFromDB,
    getSingleAcademicSemesterFromDB,
    updateSingleAcademicSemesterIntoDB
};
