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
exports.generateAdminId = exports.generateFacultyId = exports.generateStudentId = void 0;
const admin_service_1 = require("./../admin/admin.service");
const student_service_1 = require("../student/student.service");
const faculty_service_1 = require("../faculty/faculty.service");
const generateStudentId = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield student_service_1.StudentServices.findLastStudentId(payload._id.toString())) || (0).toString();
    let incrementedId = String(Number(currentId) + 1).padStart(4, '0');
    incrementedId = `${payload.year}${payload.code}${incrementedId}`;
    return incrementedId;
});
exports.generateStudentId = generateStudentId;
const generateFacultyId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield faculty_service_1.FacultyServices.findLastFacultyId()) || (0).toString();
    let incrementedId = String(Number(currentId) + 1).padStart(4, '0');
    incrementedId = `F-${incrementedId}`;
    return incrementedId;
});
exports.generateFacultyId = generateFacultyId;
const generateAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield admin_service_1.AdminServices.findLastAdminId()) || (0).toString();
    let incrementedId = String(Number(currentId) + 1).padStart(4, '0');
    incrementedId = `A-${incrementedId}`;
    return incrementedId;
});
exports.generateAdminId = generateAdminId;
