import type { ITableVo } from '@teable/openapi';
import type { Doc } from 'sharedb/lib/client';
import { Table } from './table';
export declare function createTableInstance(tableSnapshot: ITableVo, doc?: Doc<ITableVo>): Table;
