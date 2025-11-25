"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListSchemaVo = void 0;
const zod_1 = require("./zod");
const getListSchemaVo = (item) => {
    return zod_1.z.object({
        total: zod_1.z.number(),
        list: zod_1.z.array(item),
    });
};
exports.getListSchemaVo = getListSchemaVo;
