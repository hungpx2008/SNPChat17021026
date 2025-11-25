/// <reference types="react" />
import type { IGetRecordsRo } from '@teable/openapi';
import type { Record as IRecord } from '../../../model';
import type { IGridRef } from '../../grid/Grid';
import type { ICell, ICellItem, IGridColumn, IInnerCell } from '../../grid/interface';
import { CombinedSelection } from '../../grid/managers';
interface IUseGridSelectionProps {
    recordMap: Record<string, IRecord>;
    columns: (IGridColumn & {
        id: string;
    })[];
    viewQuery?: Pick<IGetRecordsRo, 'filter' | 'orderBy' | 'groupBy' | 'collapsedGroupIds'>;
    gridRef: React.RefObject<IGridRef>;
}
export interface IActiveCell {
    recordId: string;
    fieldId: string;
    rowIndex: number;
    columnIndex: number;
}
export declare const useGridSelection: (props: IUseGridSelectionProps) => {
    activeCell: IActiveCell | undefined;
    presortRecord: IRecord | undefined;
    presortRecordData: {
        rowIndex: number;
        recordId: string;
    } | undefined;
    onSelectionChanged: (selection: CombinedSelection) => void;
    onPresortCellEdited: (cell: ICellItem, newVal: IInnerCell) => IRecord | undefined;
    getPresortCellContent: (cell: ICellItem) => ICell;
    setPresortRecordData: import("react").Dispatch<import("react").SetStateAction<{
        rowIndex: number;
        recordId: string;
    } | undefined>>;
};
export {};
