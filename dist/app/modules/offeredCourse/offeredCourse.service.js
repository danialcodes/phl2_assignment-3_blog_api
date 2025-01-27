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
exports.OfferedCourseServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const offeredCourse_model_1 = require("./offeredCourse.model");
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const academicFaculty_model_1 = require("../academicFaculty/academicFaculty.model");
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const course_model_1 = require("../course/course.model");
const faculty_model_1 = require("../faculty/faculty.model");
const semesterRegistration_const_1 = require("../semesterRegistration/semesterRegistration.const");
const createOfferedCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime } = payload;
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.isExists(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Semester Registration not found");
    }
    if (isSemesterRegistrationExists.status !== semesterRegistration_const_1.RegistrationStatus.UPCOMING) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `Cannot create a course for ${isSemesterRegistrationExists.status} semester registration`);
    }
    const academicSemester = isSemesterRegistrationExists.academicSemester;
    const isAcademicFacultyExists = yield academicFaculty_model_1.AcademicFaculty.isExists(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Academic Faculty not found");
    }
    const isAcademicDepartmentExists = yield academicDepartment_model_1.AcademicDepartment.isExists(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Academic Department not found");
    }
    const isCourseExists = yield course_model_1.Course.isCourseExists(course);
    if (!isCourseExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Course not found");
    }
    const isFacultyExists = yield faculty_model_1.Faculty.isExists(faculty);
    if (!isFacultyExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Faculty not found");
    }
    // check if the academic department belongs to the academic faculty
    const isDeptFactMatched = isAcademicDepartmentExists.academicFaculty == academicFaculty;
    if (!isDeptFactMatched) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `${isAcademicFacultyExists.name} does not have ${isAcademicDepartmentExists.name}`);
    }
    //check if same course with same section for a semester is already offered
    const duplicateOfferedCourse = yield offeredCourse_model_1.OfferedCourse.findOne({ semesterRegistration, course, section });
    if (duplicateOfferedCourse) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Course ${isCourseExists.title} with section ${section} is already offered for this semester`);
    }
    // resolve faculty time table clash
    const newSchedule = { days, startTime, endTime };
    const hasFacultyTimeConflict = yield offeredCourse_model_1.OfferedCourse.hasFacultyTimeConflict(faculty, semesterRegistration, newSchedule);
    if (hasFacultyTimeConflict) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `Faculty ${isFacultyExists.name} has time clash with another course`);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.create(Object.assign(Object.assign({}, payload), { academicSemester }));
    return result;
});
const getOfferedCourseFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const offeredCourseQuery = new QueryBuilder_1.default(offeredCourse_model_1.OfferedCourse.find().populate('semesterRegistration academicDepartment academicSemester academicFaculty course faculty'), query).filter().sort().paginate().fields();
    const result = yield offeredCourseQuery.modelQuery;
    return result;
});
const getSingleOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const offeredCourse = yield offeredCourse_model_1.OfferedCourse.findById(id).populate('semesterRegistration academicDepartment academicSemester academicFaculty course faculty');
    return offeredCourse;
});
const updateOfferedCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { faculty, days, startTime, endTime } = payload;
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.isExists(id);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Offered Course not found");
    }
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterStatus = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration).select('status');
    if ((semesterStatus === null || semesterStatus === void 0 ? void 0 : semesterStatus.status) !== semesterRegistration_const_1.RegistrationStatus.UPCOMING) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `Cannot update a ${semesterStatus === null || semesterStatus === void 0 ? void 0 : semesterStatus.status} semester registration`);
    }
    // faculty is made conpulsory in validation
    // checking if faculty  exists in the faculty collection
    const isFacultyExists = yield faculty_model_1.Faculty.isExists(faculty);
    if (!isFacultyExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Faculty not found");
    }
    const newSchedule = { days, startTime, endTime };
    const hasFacultyTimeConflict = yield offeredCourse_model_1.OfferedCourse.hasFacultyTimeConflict(faculty, semesterRegistration, newSchedule);
    if (hasFacultyTimeConflict) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `Faculty ${isFacultyExists.name} has time clash with another course`);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.isExists(id);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Offered Course not found");
    }
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterStatus = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration).select('status');
    if ((semesterStatus === null || semesterStatus === void 0 ? void 0 : semesterStatus.status) !== semesterRegistration_const_1.RegistrationStatus.UPCOMING) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `Cannot delete a ${semesterStatus === null || semesterStatus === void 0 ? void 0 : semesterStatus.status} semester registration`);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.findByIdAndDelete(id);
    return result;
});
exports.OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getOfferedCourseFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB
};
