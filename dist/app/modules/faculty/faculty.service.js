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
exports.FacultyServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_service_1 = require("../user/user.service");
const faculty_const_1 = require("./faculty.const");
const faculty_model_1 = require("./faculty.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const initialFacultyCreate = (facultyData, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faculty_model_1.Faculty.create([facultyData], { session });
    return result;
});
const getAllFacultiesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const facultyQuery = new QueryBuilder_1.default(faculty_model_1.Faculty.find().populate({
        path: "academicDepartment",
        populate: {
            path: "academicFaculty"
        }
    }), query).search(faculty_const_1.facultySearchFields).filter().sort().paginate().fields();
    const result = yield facultyQuery.modelQuery;
    return result;
});
const getSingleFacultyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faculty_model_1.Faculty.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Faculty does not exists");
    }
    return result;
});
const updateSingleFacultyIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const modifiedPayload = {};
    for (const [key, value] of Object.entries(payload)) {
        if (key === 'name') {
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
    const result = yield faculty_model_1.Faculty.findByIdAndUpdate(id, modifiedPayload, { new: true, runValidators: true });
    return result;
});
const deleteSingleFacultyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield faculty_model_1.Faculty.isUserExists(id))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Faculty does not exists");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedFaculty = yield faculty_model_1.Faculty.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedFaculty) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.EXPECTATION_FAILED, "Failed to delete faculty");
        }
        const deletedUser = yield user_service_1.UserServices.deleteUserFromDB(deletedFaculty.user, session);
        if (!deletedUser) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.EXPECTATION_FAILED, "Failed to delete user");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedFaculty;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
});
const findLastFacultyId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastFaculty = yield faculty_model_1.Faculty.findOne({}, { id: 1, _id: 0 }).sort({ createdAt: -1 }).lean();
    return (lastFaculty === null || lastFaculty === void 0 ? void 0 : lastFaculty.id) ? lastFaculty.id.substring(2) : undefined;
});
exports.FacultyServices = {
    initialFacultyCreate,
    getAllFacultiesFromDB,
    getSingleFacultyFromDB,
    updateSingleFacultyIntoDB,
    deleteSingleFacultyFromDB,
    findLastFacultyId
};
