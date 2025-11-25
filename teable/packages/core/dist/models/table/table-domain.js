"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableDomain = void 0;
const table_fields_1 = require("./table-fields");
/**
 * TableDomain represents a table with its fields and provides methods to interact with them
 * This is a domain object that encapsulates table-related business logic
 */
class TableDomain {
    id;
    name;
    dbTableName;
    icon;
    description;
    lastModifiedTime;
    baseId;
    dbViewName;
    _fields;
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.dbTableName = params.dbTableName;
        this.icon = params.icon;
        this.description = params.description;
        this.lastModifiedTime = params.lastModifiedTime;
        this.baseId = params.baseId;
        this.dbViewName = params.dbViewName;
        this._fields = new table_fields_1.TableFields(params.fields);
    }
    getTableNameAndId() {
        return `${this.name}_${this.id}`;
    }
    /**
     * Get the fields collection
     */
    get fields() {
        return this._fields;
    }
    /**
     * Get all fields as readonly array
     */
    get fieldList() {
        return this._fields.fields;
    }
    get fieldMap() {
        return this._fields.toFieldMap();
    }
    /**
     * Get field count
     */
    get fieldCount() {
        return this._fields.length;
    }
    /**
     * Check if table has any fields
     */
    get hasFields() {
        return !this._fields.isEmpty;
    }
    /**
     * Add a field to the table
     */
    addField(field) {
        this._fields.add(field);
    }
    /**
     * Add multiple fields to the table
     */
    addFields(fields) {
        this._fields.addMany(fields);
    }
    /**
     * Remove a field from the table
     */
    removeField(fieldId) {
        return this._fields.remove(fieldId);
    }
    /**
     * Find a field by id
     */
    getField(fieldId) {
        return this._fields.findById(fieldId);
    }
    /**
     * Find a field by id, throw error if not found
     */
    mustGetField(fieldId) {
        const field = this.getField(fieldId);
        if (!field) {
            throw new Error(`Field ${fieldId} not found`);
        }
        return field;
    }
    /**
     * Find a field by name
     */
    getFieldByName(name) {
        return this._fields.findByName(name);
    }
    /**
     * Find a field by database field name
     */
    getFieldByDbName(dbFieldName) {
        return this._fields.findByDbFieldName(dbFieldName);
    }
    /**
     * Check if a field exists
     */
    hasField(fieldId) {
        return this._fields.hasField(fieldId);
    }
    /**
     * Check if a field name exists
     */
    hasFieldName(name) {
        return this._fields.hasFieldName(name);
    }
    /**
     * Get the primary field
     */
    getPrimaryField() {
        return this._fields.getPrimaryField();
    }
    /**
     * Get all computed fields
     */
    getComputedFields() {
        return this._fields.getComputedFields();
    }
    /**
     * Get all lookup fields
     */
    getLookupFields() {
        return this._fields.getLookupFields();
    }
    /**
     * Update a field in the table
     */
    updateField(fieldId, updatedField) {
        return this._fields.update(fieldId, updatedField);
    }
    /**
     * Get all field ids
     */
    getFieldIds() {
        return this._fields.getIds();
    }
    /**
     * Get all field names
     */
    getFieldNames() {
        return this._fields.getNames();
    }
    /**
     * Create a field map by id
     */
    createFieldMap() {
        return this._fields.toFieldMap();
    }
    /**
     * Create a field map by name
     */
    createFieldNameMap() {
        return this._fields.toFieldNameMap();
    }
    /**
     * Filter fields by predicate
     */
    filterFields(predicate) {
        return this._fields.filter(predicate);
    }
    /**
     * Map fields to another type
     */
    mapFields(mapper) {
        return this._fields.map(mapper);
    }
    /**
     * Get all foreign table IDs from link fields
     */
    getAllForeignTableIds() {
        return this._fields.getAllForeignTableIds();
    }
    /**
     * Create a copy of the table domain object
     */
    clone() {
        return new TableDomain({
            id: this.id,
            name: this.name,
            dbTableName: this.dbTableName,
            icon: this.icon,
            description: this.description,
            lastModifiedTime: this.lastModifiedTime,
            baseId: this.baseId,
            dbViewName: this.dbViewName,
            fields: this._fields.toArray(),
        });
    }
    /**
     * Convert to plain object representation
     */
    toPlainObject() {
        return {
            id: this.id,
            name: this.name,
            dbTableName: this.dbTableName,
            icon: this.icon,
            description: this.description,
            lastModifiedTime: this.lastModifiedTime,
            baseId: this.baseId,
            dbViewName: this.dbViewName,
            fields: this._fields.toArray(),
            fieldCount: this.fieldCount,
        };
    }
}
exports.TableDomain = TableDomain;
