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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourse = void 0;
const mongoose_1 = require("mongoose");
const offeredCourse_const_1 = require("./offeredCourse.const");
const offeredCourseSchema = new mongoose_1.Schema({
    semesterRegistration: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'SemesterRegistration',
        required: true,
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
        required: true,
    },
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicSemester',
        required: true,
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
        required: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    faculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true,
    },
    maxCapacity: {
        type: Number,
        required: true,
    },
    section: {
        type: Number,
        required: true,
    },
    days: {
        type: [String],
        enum: offeredCourse_const_1.Days,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
offeredCourseSchema.static('isExists', function isExists(id) {
    return this.findById(id);
});
offeredCourseSchema.static('hasFacultyTimeConflict', function hasFacultyTimeConflict(faculty, semesterRegistration, newSchedule) {
    return __awaiter(this, void 0, void 0, function* () {
        const { days, startTime, endTime } = newSchedule;
        const assignedScheduleOfFaculty = yield exports.OfferedCourse.find({
            faculty,
            semesterRegistration,
            days: { $in: days }
        }).select('startTime endTime');
        for (const schedule of assignedScheduleOfFaculty) {
            const isStartTimeClash = (startTime >= schedule.startTime && startTime <= schedule.endTime);
            const isEndTimeClash = (endTime >= schedule.startTime && endTime <= schedule.endTime);
            if (isStartTimeClash || isEndTimeClash) {
                return true;
            }
        }
        return false;
    });
});
exports.OfferedCourse = (0, mongoose_1.model)('OfferedCourse', offeredCourseSchema);
