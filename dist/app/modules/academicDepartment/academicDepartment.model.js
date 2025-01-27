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
exports.AcademicDepartment = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicFaculty_service_1 = require("../academicFaculty/academicFaculty.service");
const academicDepartmentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});
academicDepartmentSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAcademicDepartmentExists = yield exports.AcademicDepartment.findOne({ name: this.name });
        const isAcademicFacultyExists = yield academicFaculty_service_1.AcademicFacultyServices.getSingleAcademicFacultyFromDB(this.academicFaculty.toString());
        if (isAcademicDepartmentExists) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Academic department already exists");
        }
        else if (!isAcademicFacultyExists) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Academic faculty does not exists");
        }
        next();
    });
});
academicDepartmentSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = this.getQuery();
        const isAcademicDepartmentExists = yield exports.AcademicDepartment.findOne(query);
        if (!isAcademicDepartmentExists) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Academic department does not exists");
        }
        next();
    });
});
academicDepartmentSchema.static('isExists', function isExists(id) {
    return this.findById(id);
});
exports.AcademicDepartment = (0, mongoose_1.model)('AcademicDepartment', academicDepartmentSchema);
