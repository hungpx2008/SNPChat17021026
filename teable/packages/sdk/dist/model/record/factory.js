import { plainToInstance } from 'class-transformer';
import { Record } from './record';
export function createRecordInstance(record, doc) {
    const instance = plainToInstance(Record, record);
    // force inject object into instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp = instance;
    temp.doc = doc;
    return instance;
}
export function recordInstanceFieldMap(instance, fieldMap) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp = instance;
    temp.fieldMap = fieldMap;
    return instance;
}
