import { FieldKeyType, TableCore } from '@teable/core';
import { convertField, createField, createRecords, createView, deleteField, deleteView, getAggregation, getRowCount, getViewList, updateDbTableName, updateField, updateTableDescription, updateTableIcon, updateTableName, updateTableOrder, } from '@teable/openapi';
import { requestWrap } from '../../utils/requestWrap';
export class Table extends TableCore {
    static getAggregations = requestWrap(getAggregation);
    static getRowCount = requestWrap(getRowCount);
    doc;
    baseId;
    permission;
    async getViews() {
        return getViewList(this.id);
    }
    async updateName(name) {
        return requestWrap(updateTableName)(this.baseId, this.id, { name });
    }
    async updateDbTableName(dbTableName) {
        return requestWrap(updateDbTableName)(this.baseId, this.id, { dbTableName });
    }
    async updateDescription(description) {
        return requestWrap(updateTableDescription)(this.baseId, this.id, { description });
    }
    async updateIcon(icon) {
        return requestWrap(updateTableIcon)(this.baseId, this.id, { icon });
    }
    async updateOrder(orderRo) {
        return requestWrap(updateTableOrder)(this.baseId, this.id, orderRo);
    }
    async createView(viewRo) {
        return createView(this.id, viewRo);
    }
    async deleteView(viewId) {
        return deleteView(this.id, viewId);
    }
    async createRecord(recordFields, recordOrder) {
        return createRecords(this.id, {
            fieldKeyType: FieldKeyType.Id,
            records: [
                {
                    fields: recordFields,
                },
            ],
            order: recordOrder,
        });
    }
    async createField(fieldRo) {
        return createField(this.id, fieldRo);
    }
    async updateField(fieldId, fieldRo) {
        return updateField(this.id, fieldId, fieldRo);
    }
    async convertField(fieldId, fieldRo) {
        return convertField(this.id, fieldId, fieldRo);
    }
    async deleteField(fieldId) {
        return deleteField(this.id, fieldId);
    }
}
