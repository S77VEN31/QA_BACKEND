// Department Controller
import {
  getDepartments,
  createDepartment,
  assignSalaryToDepartment,
  insertEmployeesIntoDepartment,
} from "./department.controller";

// Report Controller
import { getReportDetail, getReportTotal } from "./report.controller";
// Fortnight controller
import { insertFortnight, insertNFortnights } from "./fortnight.controller";

export {
  getDepartments,
  createDepartment,
  assignSalaryToDepartment,
  getReportDetail,
  insertEmployeesIntoDepartment,
  getReportTotal,
  insertFortnight,
  insertNFortnights,
};
