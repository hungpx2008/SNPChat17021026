import { jsx as _jsx } from "react/jsx-runtime";
import { defaults } from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { generateLocalId, useGridCollapsedGroupStore } from '../../components';
import { useTableId, useViews } from '../../hooks';
import { createViewInstance } from '../../model/view/factory';
import { usePersonalViewStore } from './store';
import { ViewContext } from './ViewContext';
const getViewData = (view, initData) => {
    return (view?.['doc']?.data || initData?.find((v) => v.id === view?.id));
};
const mergeColumnMeta = (localColumnMeta, remoteColumnMeta) => {
    const filteredLocalMeta = Object.keys(localColumnMeta).reduce((acc, key) => {
        if (key in remoteColumnMeta) {
            acc[key] = localColumnMeta[key];
        }
        return acc;
    }, {});
    return defaults({}, filteredLocalMeta, remoteColumnMeta);
};
export const PersonalViewProxy = (props) => {
    const { serverData, children } = props;
    const views = useViews();
    const tableId = useTableId();
    const { setCollapsedGroupMap } = useGridCollapsedGroupStore();
    const { personalViewMap, isPersonalView, setPersonalViewMap } = usePersonalViewStore();
    const generateProxyView = useCallback((view, serverData) => {
        const viewData = getViewData(view, serverData);
        const viewId = viewData.id;
        const newViewProxy = createViewInstance(viewData);
        const cachedView = personalViewMap?.[viewId];
        newViewProxy.tableId = tableId;
        newViewProxy.filter = cachedView?.filter;
        newViewProxy.sort = cachedView?.sort;
        newViewProxy.group = cachedView?.group;
        newViewProxy.options = cachedView?.options;
        const columnMeta = mergeColumnMeta((cachedView?.columnMeta ?? {}), viewData.columnMeta);
        newViewProxy.columnMeta = columnMeta;
        newViewProxy.updateFilter = (filter) => {
            setPersonalViewMap(viewId, (prev) => ({
                ...prev,
                filter,
            }));
        };
        newViewProxy.updateSort = (sort) => {
            setPersonalViewMap(viewId, (prev) => ({
                ...prev,
                sort,
            }));
        };
        newViewProxy.updateGroup = (group) => {
            setPersonalViewMap(viewId, (prev) => ({
                ...prev,
                group,
            }));
            setCollapsedGroupMap(generateLocalId(tableId, view.id), []);
        };
        newViewProxy.updateOption = (options) => {
            setPersonalViewMap(viewId, (prev) => ({
                ...prev,
                options: { ...(prev.options ?? {}), ...options },
            }));
        };
        newViewProxy.updateColumnMeta = (columnMetaRo) => {
            setPersonalViewMap(viewId, (prev) => {
                const columnMetaMap = columnMetaRo.reduce((acc, { fieldId, columnMeta }) => {
                    acc[fieldId] = {
                        ...prev.columnMeta?.[fieldId],
                        ...columnMeta,
                    };
                    return acc;
                }, {});
                return {
                    ...prev,
                    columnMeta: {
                        ...(prev.columnMeta ?? {}),
                        ...columnMetaMap,
                    },
                };
            });
        };
        newViewProxy.syncViewProperties = async () => {
            const cachedView = personalViewMap?.[viewId];
            if (!cachedView || !view)
                return;
            if (JSON.stringify(cachedView.filter) !== JSON.stringify(viewData.filter)) {
                await view.updateFilter(cachedView.filter ?? null);
            }
            if (JSON.stringify(cachedView.sort) !== JSON.stringify(viewData.sort)) {
                await view.updateSort(cachedView.sort ?? null);
            }
            if (JSON.stringify(cachedView.group) !== JSON.stringify(viewData.group)) {
                await view.updateGroup(cachedView.group ?? null);
                setCollapsedGroupMap(generateLocalId(tableId, view.id), []);
                view.group = cachedView.group;
            }
            if (JSON.stringify(cachedView.options) !== JSON.stringify(viewData.options)) {
                await view?.updateOption(cachedView.options);
            }
            if (JSON.stringify(cachedView.columnMeta) !== JSON.stringify(viewData.columnMeta) &&
                cachedView.columnMeta) {
                const columnMetaRo = Object.entries(cachedView.columnMeta).map(([fieldId, columnMeta]) => ({
                    fieldId,
                    columnMeta,
                }));
                await view?.updateColumnMeta(columnMetaRo);
            }
        };
        return newViewProxy;
    }, [tableId, personalViewMap, setPersonalViewMap, setCollapsedGroupMap]);
    const proxyViews = useMemo(() => {
        if (!tableId || !views?.length)
            return views ?? [];
        return views.map((view) => {
            if (!isPersonalView(view.id))
                return view;
            return generateProxyView(view, serverData);
        });
    }, [views, tableId, serverData, isPersonalView, generateProxyView]);
    useEffect(() => {
        views.forEach((view) => {
            if (!isPersonalView(view.id))
                return view;
            // When adding or deleting fields, update columnMeta
            setPersonalViewMap(view.id, (prev) => {
                const columnMeta = mergeColumnMeta((prev?.columnMeta ?? {}), view.columnMeta);
                return {
                    ...prev,
                    columnMeta,
                };
            });
        });
    }, [isPersonalView, setPersonalViewMap, views]);
    return (_jsx(ViewContext.Provider, { value: { views: proxyViews }, children: children }));
};
