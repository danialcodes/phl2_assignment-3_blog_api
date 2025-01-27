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
exports.UserServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicSemester_service_1 = require("../academicSemester/academicSemester.service");
const student_service_1 = require("../student/student.service");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const faculty_service_1 = require("../faculty/faculty.service");
const academicDepartment_service_1 = require("../academicDepartment/academicDepartment.service");
const admin_service_1 = require("../admin/admin.service");
const createStudentIntoDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (password = config_1.default.default_password, payload) {
    const admissionSemester = yield academicSemester_service_1.AcademicSemesterServices.getSingleAcademicSemesterFromDB(payload.admissionSemester.toString());
    if (!admissionSemester) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Invalid admission semester");
    }
    const academicDepartment = yield academicDepartment_service_1.AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(payload.academicDepartment.toString());
    if (!academicDepartment) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Invalid academic department");
    }
    const studentData = {
        id: yield (0, user_utils_1.generateStudentId)(admissionSemester),
        password,
        role: 'student'
    };
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // transaction 1
        const newUser = yield user_model_1.User.create([studentData], { session }); // array
        if (!newUser.length) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "User creation failed");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        // transaction 2
        const newStudent = yield student_service_1.StudentServices.initialStudentCreate(payload, session);
        if (!newStudent.length) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Student creation failed");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newStudent;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        // throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,err.message);
        throw new Error(err);
    }
});
const createFacultyIntoDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (password = config_1.default.default_password, payload) {
    const academicDepartment = yield academicDepartment_service_1.AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(payload.academicDepartment.toString());
    if (!academicDepartment) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Invalid academic department");
    }
    const facultyData = {
        id: yield (0, user_utils_1.generateFacultyId)(),
        password,
        role: 'faculty'
    };
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // transaction 1
        const newUser = yield user_model_1.User.create([facultyData], { session }); // array
        if (!newUser.length) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "User creation failed");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        // transaction 2
        const newFaculty = yield faculty_service_1.FacultyServices.initialFacultyCreate(payload, session);
        if (!newFaculty.length) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Faculty creation failed");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newFaculty;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        // throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,err.message);
        throw new Error(err);
    }
});
const createAdminIntoDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (password = config_1.default.default_password, payload) {
    const adminData = {
        id: yield (0, user_utils_1.generateAdminId)(),
        password,
        role: 'admin'
    };
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // transaction 1
        const newUser = yield user_model_1.User.create([adminData], { session }); // array
        if (!newUser.length) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "User creation failed");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        // transaction 2
        const newAdmin = yield admin_service_1.AdminServices.initialAdminCreate(payload, session);
        if (!newAdmin.length) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Admin creation failed");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newAdmin;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        // throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,err.message);
        throw new Error(err);
    }
});
const deleteUserFromDB = (id, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
    return result;
});
exports.UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    deleteUserFromDB
};
