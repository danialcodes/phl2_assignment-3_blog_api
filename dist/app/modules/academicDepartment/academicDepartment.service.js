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
exports.AcademicDepartmentServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicDepartment_model_1 = require("./academicDepartment.model");
const createAcademicDepartmentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newDepartment = yield academicDepartment_model_1.AcademicDepartment.create(payload);
    return newDepartment;
});
const getAllAcademicDepartmentFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const academicDepartment = yield academicDepartment_model_1.AcademicDepartment.find({}).populate('academicFaculty');
    return academicDepartment;
});
const getSingleAcademicDepartmentFromDB = (departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const academicDepartment = yield academicDepartment_model_1.AcademicDepartment.findById(departmentId).populate('academicFaculty');
    return academicDepartment;
});
const updateSingleAcademicDepartmentIntoDB = (departmentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedDepartment = yield academicDepartment_model_1.AcademicDepartment.isExists(departmentId);
    if (!requestedDepartment) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Academic Department not found');
    }
    const result = yield academicDepartment_model_1.AcademicDepartment.findOneAndUpdate({ _id: departmentId }, payload, {
        new: true,
    });
    return result;
});
exports.AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentFromDB,
    getSingleAcademicDepartmentFromDB,
    updateSingleAcademicDepartmentIntoDB
};
