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
exports.SemesterRegistrationServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicSemester_model_1 = require("../academicSemester/academicSemester.model");
const offeredCourse_model_1 = require("../offeredCourse/offeredCourse.model");
const semesterRegistration_const_1 = require("./semesterRegistration.const");
const semesterRegistration_model_1 = require("./semesterRegistration.model");
const createSemesterRegistrationIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { academicSemester } = payload;
    //checking if another semester registration is already running or not
    const runningSemester = yield semesterRegistration_model_1.SemesterRegistration.hasRunningSemester();
    if (runningSemester) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `A semester registration is already ${runningSemester.status}`);
    }
    // Need to check if semester registration for
    // the academic semester already exists or not
    // using the academic semester id
    // though as the academic semester id is unique
    // in the semester registration model
    const isAcademicSemesterAlreadyExists = yield semesterRegistration_model_1.SemesterRegistration.isAcademicSemesterAlreadyExists(academicSemester);
    if (isAcademicSemesterAlreadyExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Semester Registration for this Academic Semester already exists");
    }
    // Check if the academic semester exists or not
    // through the academic semester id
    // using the isExists static method of the AcademicSemester model
    const isSemesterExists = yield academicSemester_model_1.AcademicSemester.isExists(academicSemester);
    if (!isSemesterExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "This Academic Semester does not exists");
    }
    const newSemesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.create(payload);
    return newSemesterRegistration;
});
const getSemesterRegistrationFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistrationQuery = new QueryBuilder_1.default(semesterRegistration_model_1.SemesterRegistration.find().populate('academicSemester'), query).filter().sort().paginate().fields();
    const result = yield semesterRegistrationQuery.modelQuery;
    return result;
});
const getSingleSemesterRegistrationFromDB = (semesterId) => __awaiter(void 0, void 0, void 0, function* () {
    const semester = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterId);
    return semester;
});
const updateSemesterRegistrationIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedSemester = yield semesterRegistration_model_1.SemesterRegistration.isExists(id);
    const currentSemesterRegistrationStatus = requestedSemester.status;
    const requestedSemesterRegistrationStatus = payload.status;
    if (!requestedSemester) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Requested Semester Registration not found");
    }
    if (currentSemesterRegistrationStatus === semesterRegistration_const_1.RegistrationStatus.COMPLETED) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Cannot update a completed semester registration");
    }
    if ((currentSemesterRegistrationStatus === semesterRegistration_const_1.RegistrationStatus.ONGOING && requestedSemesterRegistrationStatus === semesterRegistration_const_1.RegistrationStatus.UPCOMING)
        ||
            (currentSemesterRegistrationStatus === semesterRegistration_const_1.RegistrationStatus.UPCOMING && requestedSemesterRegistrationStatus === semesterRegistration_const_1.RegistrationStatus.COMPLETED)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `Cannot directly update a ${currentSemesterRegistrationStatus} semester registration to ${requestedSemesterRegistrationStatus}`);
    }
    const updatedSemester = yield semesterRegistration_model_1.SemesterRegistration.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return updatedSemester;
});
const deleteSemesterRegistrationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedSemester = yield semesterRegistration_model_1.SemesterRegistration.isExists(id);
    if (!requestedSemester) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Requested Semester Registration not found");
    }
    const semesterRegistrationStatus = requestedSemester.status;
    if (semesterRegistrationStatus !== semesterRegistration_const_1.RegistrationStatus.UPCOMING) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `Cannot delete a ${semesterRegistrationStatus} semester registration`);
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        yield semesterRegistration_model_1.SemesterRegistration.findByIdAndDelete(id, { session });
        yield offeredCourse_model_1.OfferedCourse.deleteMany({ semesterRegistration: id }, { session });
        yield session.commitTransaction();
        yield session.endSession();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        // throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,err.message);
        throw new Error(err);
    }
});
exports.SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
};
