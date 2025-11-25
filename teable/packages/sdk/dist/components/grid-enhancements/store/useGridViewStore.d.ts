import type { CombinedSelection } from '../../grid/managers';
import type { IGroupHeaderMenu, IHeaderMenu, IRecordMenu, IStatisticMenu } from './type';
interface IGridViewState {
    selection?: CombinedSelection;
    headerMenu?: IHeaderMenu;
    recordMenu?: IRecordMenu;
    statisticMenu?: IStatisticMenu;
    groupHeaderMenu?: IGroupHeaderMenu;
    openHeaderMenu: (props: IHeaderMenu) => void;
    closeHeaderMenu: () => void;
    openRecordMenu: (props: IRecordMenu) => void;
    closeRecordMenu: () => void;
    openStatisticMenu: (props: IStatisticMenu) => void;
    closeStatisticMenu: () => void;
    setSelection: (props: CombinedSelection) => void;
    openGroupHeaderMenu: (props: IGroupHeaderMenu) => void;
    closeGroupHeaderMenu: () => void;
}
export declare const useGridViewStore: import("zustand").UseBoundStore<import("zustand").StoreApi<IGridViewState>>;
export {};
