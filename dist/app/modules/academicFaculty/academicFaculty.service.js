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
exports.AcademicFacultyServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicFaculty_model_1 = require("./academicFaculty.model");
const createAcademicFacultyIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newFaculty = yield academicFaculty_model_1.AcademicFaculty.create(payload);
    return newFaculty;
});
const getAllAcademicFacultiesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const academicFaculties = yield academicFaculty_model_1.AcademicFaculty.find({});
    return academicFaculties;
});
const getSingleAcademicFacultyFromDB = (facultyId) => __awaiter(void 0, void 0, void 0, function* () {
    const academicFaculty = yield academicFaculty_model_1.AcademicFaculty.findById(facultyId);
    return academicFaculty;
});
const updateSingleAcademicFacultyIntoDB = (facultyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedFaculty = yield academicFaculty_model_1.AcademicFaculty.isExists(facultyId);
    if (!requestedFaculty) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Faculty not found');
    }
    const result = yield academicFaculty_model_1.AcademicFaculty.findOneAndUpdate({ _id: facultyId }, payload, {
        new: true,
    });
    return result;
});
exports.AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB,
    updateSingleAcademicFacultyIntoDB
};
