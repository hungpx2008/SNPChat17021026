import { plainToInstance } from 'class-transformer';
import { Table } from './table';
export function createTableInstance(tableSnapshot, doc) {
    const instance = plainToInstance(Table, tableSnapshot);
    // force inject object into instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp = instance;
    temp.doc = doc;
    temp.baseId = doc?.collection.split('_')[1];
    return instance;
}
