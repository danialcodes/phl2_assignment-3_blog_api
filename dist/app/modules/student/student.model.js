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
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    name: {
        firstName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required'],
        unique: true,
    },
    id: { type: String, required: true, unique: true },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    contractNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true,
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
        fatherName: { type: String, required: true },
        fatherOccupation: { type: String, required: true },
        fatherContactNo: { type: String, required: true },
        motherName: { type: String, required: true },
        motherOccupation: { type: String, required: true },
        motherContactNo: { type: String, required: true },
    },
    localGuardian: {
        name: { type: String, required: true },
        occupation: { type: String, required: true },
        contactNo: { type: String, required: true },
        address: { type: String, required: true },
    },
    profileImage: { type: String },
    isDeleted: { type: Boolean, default: false },
    admissionSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicSemester',
        required: [true, 'Academic Semester id is required'],
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
        required: [true, 'Academic Department id is required'],
    },
}, {
    timestamps: true,
    versionKey: false,
});
// // Query Middleware
// studentSchema.pre('find', function(next) {
//     this.find({isDeleted: {$ne: true}});
//     next();
// });
// studentSchema.statics.isUserExists = async function(id: string) {
//     const existsUser = Student.findOne({id});
//     return existsUser;
// }
studentSchema.static('isUserExists', function isUserExists(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existsUser = yield exports.Student.findById(id);
        return existsUser;
    });
});
exports.Student = (0, mongoose_1.model)('Student', studentSchema);
