import { ViewCore } from '@teable/core';
import { disableShareView, enableShareView, updateViewColumnMeta, manualSortView, updateViewFilter, updateViewSort, updateViewGroup, updateViewOrder, updateViewName, updateViewDescription, updateViewShareMeta, refreshViewShareId, updateViewLocked, } from '@teable/openapi';
import { requestWrap } from '../../utils/requestWrap';
export class View extends ViewCore {
    doc;
    tableId;
    async apiEnableShare() {
        return await requestWrap(enableShareView)({ tableId: this.tableId, viewId: this.id });
    }
    async disableShare() {
        return await requestWrap(disableShareView)({ tableId: this.tableId, viewId: this.id });
    }
    async manualSort(sortRo) {
        return await requestWrap(manualSortView)(this.tableId, this.id, sortRo);
    }
    async updateColumnMeta(columnMetaRo) {
        return await requestWrap(updateViewColumnMeta)(this.tableId, this.id, columnMetaRo);
    }
    async updateFilter(filter) {
        return await requestWrap(updateViewFilter)(this.tableId, this.id, { filter });
    }
    async updateSort(sort) {
        return await requestWrap(updateViewSort)(this.tableId, this.id, { sort });
    }
    async updateGroup(group) {
        return await requestWrap(updateViewGroup)(this.tableId, this.id, { group });
    }
    async updateOrder(orderRo) {
        return await requestWrap(updateViewOrder)(this.tableId, this.id, orderRo);
    }
    async updateName(name) {
        return await requestWrap(updateViewName)(this.tableId, this.id, { name });
    }
    async updateDescription(description) {
        return await requestWrap(updateViewDescription)(this.tableId, this.id, { description });
    }
    async setRefreshLink() {
        return await requestWrap(refreshViewShareId)(this.tableId, this.id);
    }
    async setShareMeta(shareMeta) {
        return await requestWrap(updateViewShareMeta)(this.tableId, this.id, shareMeta);
    }
    async updateLocked(isLocked) {
        return await requestWrap(updateViewLocked)(this.tableId, this.id, { isLocked });
    }
}
