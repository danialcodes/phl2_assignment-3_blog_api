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
exports.SemesterRegistration = void 0;
const mongoose_1 = require("mongoose");
const semesterRegistration_const_1 = require("./semesterRegistration.const");
const semesterRegistrationSchema = new mongoose_1.Schema({
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicSemester',
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: semesterRegistration_const_1.SemesterRegistrationStatus,
        default: "UPCOMING",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    minCredit: {
        type: Number,
        default: 12,
    },
    maxCredit: {
        type: Number,
        default: 3,
    }
}, {
    timestamps: true,
    versionKey: false,
});
semesterRegistrationSchema.static('hasRunningSemester', function hasRunningSemester() {
    return __awaiter(this, void 0, void 0, function* () {
        const existsSemester = yield exports.SemesterRegistration.findOne({
            $or: [
                { status: semesterRegistration_const_1.RegistrationStatus.ONGOING },
                { status: semesterRegistration_const_1.RegistrationStatus.UPCOMING }
            ]
        });
        return existsSemester;
    });
});
semesterRegistrationSchema.static('isExists', function isExists(id) {
    return this.findById(id);
});
semesterRegistrationSchema.static('isAcademicSemesterAlreadyExists', function isAcademicSemesterAlreadyExists(id) {
    return this.findOne({ academicSemester: id });
});
exports.SemesterRegistration = (0, mongoose_1.model)('SemesterRegistration', semesterRegistrationSchema);
