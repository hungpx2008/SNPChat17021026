"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastModifiedByFieldCore = void 0;
const user_field_abstract_1 = require("./abstract/user.field.abstract");
const last_modified_by_option_schema_1 = require("./last-modified-by-option.schema");
class LastModifiedByFieldCore extends user_field_abstract_1.UserAbstractCore {
    type;
    options;
    get isStructuredCellValue() {
        return true;
    }
    convertStringToCellValue(_value) {
        return null;
    }
    repair(_value) {
        return null;
    }
    validateOptions() {
        return last_modified_by_option_schema_1.lastModifiedByFieldOptionsSchema.safeParse(this.options);
    }
    accept(visitor) {
        return visitor.visitLastModifiedByField(this);
    }
}
exports.LastModifiedByFieldCore = LastModifiedByFieldCore;
