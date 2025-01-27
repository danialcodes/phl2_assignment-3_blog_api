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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const course_const_1 = require("./course.const");
const course_model_1 = require("./course.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createCourseIntoDB = (courseData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.create(courseData);
    return result;
});
const getAllCoursesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseQuery = new QueryBuilder_1.default(course_model_1.Course.find().populate("preRequisiteCourses.course"), query).search(course_const_1.courseSearchFields).filter().sort().paginate().fields();
    const result = yield courseQuery.modelQuery;
    return result;
});
const getSingleCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Course does not exists");
    }
    return result;
});
const updateSingleCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourses } = payload, rest = __rest(payload, ["preRequisiteCourses"]);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (preRequisiteCourses === null || preRequisiteCourses === void 0 ? void 0 : preRequisiteCourses.length) {
            const deletedFields = preRequisiteCourses.filter((course) => course.course && course.isDeleted).map((course) => course.course);
            const addedFields = preRequisiteCourses.filter((course) => course.course && !course.isDeleted);
            if (deletedFields.length) {
                yield course_model_1.Course.findByIdAndUpdate(id, {
                    $pull: {
                        preRequisiteCourses: {
                            course: {
                                $in: deletedFields
                            }
                        }
                    }
                }, { new: true, runValidators: true, session });
            }
            if (addedFields.length) {
                yield course_model_1.Course.findByIdAndUpdate(id, Object.assign({ $addToSet: {
                        preRequisiteCourses: {
                            $each: addedFields
                        }
                    }, $pull: {
                        preRequisiteCourses: {
                            course: {
                                $in: deletedFields
                            }
                        }
                    } }, rest), { new: true, runValidators: true, session });
            }
        }
        const result = yield course_model_1.Course.findByIdAndUpdate(id, rest, { new: true, runValidators: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error in updating course");
    }
});
const deleteSingleCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCourse = yield course_model_1.Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return deletedCourse;
});
const assignFacultyToCourse = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.CourseFaculty.findByIdAndUpdate(id, {
        course: id,
        $addToSet: {
            faculties: {
                $each: payload
            }
        }
    }, { upsert: true, new: true });
    return result;
});
const removeFacultyFromCourse = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.CourseFaculty.findByIdAndUpdate(id, {
        $pull: {
            faculties: {
                $in: payload
            }
        }
    }, { new: true });
    return result;
});
exports.CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    deleteSingleCourseFromDB,
    updateSingleCourseIntoDB,
    assignFacultyToCourse,
    removeFacultyFromCourse
};
