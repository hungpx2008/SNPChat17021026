"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTypeMap = void 0;
const types_1 = require("./types");
exports.importTypeMap = {
    [types_1.SUPPORTEDTYPE.CSV]: {
        accept: 'text/csv,text/tab-separated-values,application/csv,application/vnd.ms-excel,application/octet-stream',
        exampleUrl: 'https://www.example.com/file.csv',
        exceedSize: null,
    },
    [types_1.SUPPORTEDTYPE.EXCEL]: {
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/wps-office.xlsx,application/wps-office.xls',
        exampleUrl: 'https://www.example.com/file.xlsx',
        exceedSize: 5,
    },
};
