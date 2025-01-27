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
exports.StudentServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_service_1 = require("../user/user.service");
const student_model_1 = require("./student.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const student_const_1 = require("./student.const");
const initialStudentCreate = (studentData, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.create([studentData], { session });
    return result;
});
const getAllStudentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const studentQuery = new QueryBuilder_1.default(student_model_1.Student.find().populate({
        path: "academicDepartment",
        populate: {
            path: "academicFaculty"
        }
    }).populate("admissionSemester").populate('user'), query).search(student_const_1.studentSearchFields).filter().sort().paginate().fields();
    const result = yield studentQuery.modelQuery;
    return result;
});
const getSingleStudentsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Student does not exists");
    }
    return result;
});
const updateSingleStudentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const {name, guardian, localGuardian,...rest} = payload;
    const modifiedPayload = {};
    for (const [key, value] of Object.entries(payload)) {
        if (key === 'name' || key === 'guardian' || key === 'localGuardian') {
            if (Object.keys(value).length) {
                for (const [k, v] of Object.entries(value)) {
                    modifiedPayload[`${key}.${k}`] = v;
                }
            }
        }
        else {
            modifiedPayload[key] = value;
        }
    }
    const result = yield student_model_1.Student.findByIdAndUpdate(id, modifiedPayload, { new: true, runValidators: true });
    return result;
});
const deleteSingleStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield student_model_1.Student.isUserExists(id))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Student does not exists");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedStudents = yield student_model_1.Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedStudents) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.EXPECTATION_FAILED, "Failed to delete student");
        }
        const deletedUser = yield user_service_1.UserServices.deleteUserFromDB(deletedStudents.user, session);
        if (!deletedUser) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.EXPECTATION_FAILED, "Failed to delete user");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedStudents;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
});
const findLastStudentId = (admissionSemester) => __awaiter(void 0, void 0, void 0, function* () {
    const lastStudent = yield student_model_1.Student.findOne({ admissionSemester }, { id: 1, _id: 0 }).sort({ createdAt: -1 }).lean();
    return (lastStudent === null || lastStudent === void 0 ? void 0 : lastStudent.id) ? lastStudent.id.substring(6) : undefined;
});
exports.StudentServices = {
    initialStudentCreate,
    getAllStudentsFromDB,
    getSingleStudentsFromDB,
    updateSingleStudentIntoDB,
    deleteSingleStudentFromDB,
    findLastStudentId
};
