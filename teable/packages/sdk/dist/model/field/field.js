import { FieldCore } from '@teable/core';
import { createField, deleteField, convertField, updateField } from '@teable/openapi';
export class Field extends FieldCore {
    tableId;
    doc;
    get canReadFieldRecord() {
        return this.recordRead !== false;
    }
    get canCreateFieldRecord() {
        return this.recordCreate !== false;
    }
    async create(fieldRo) {
        return createField(this.tableId, fieldRo);
    }
    async update(updateFieldRo) {
        return updateField(this.tableId, this.id, updateFieldRo);
    }
    async convert(fieldRo) {
        return convertField(this.tableId, this.id, fieldRo);
    }
    async delete() {
        return deleteField(this.tableId, this.id);
    }
}
