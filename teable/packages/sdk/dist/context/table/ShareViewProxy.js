import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useView } from '../../hooks/use-view';
import { createViewInstance } from '../../model/view/factory';
import { ViewContext } from '../view/ViewContext';
// Properties that don't need to be updated when view updates come from op
const enableKey = ['filter', 'sort'];
export const getViewData = (view, initData) => {
    const data = view?.['doc']?.data || initData?.[0];
    if (!data) {
        return;
    }
    const enableValue = enableKey.reduce((acc, key) => {
        acc[key] = null;
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {});
    return { ...data, ...enableValue };
};
export const ShareViewProxy = (props) => {
    const { serverData, children } = props;
    const view = useView();
    const [viewData, setViewData] = useState(getViewData(view, serverData));
    const [proxyView, setProxyView] = useState(() => {
        if (!viewData || !view?.id)
            return;
        return createViewInstance(viewData);
    });
    useEffect(() => {
        setViewData((viewData) => ({ ...getViewData(view, serverData), ...viewData }));
    }, [serverData, view]);
    useEffect(() => {
        if (!viewData || !view?.id)
            return;
        const newViewProxy = createViewInstance(viewData);
        newViewProxy.updateSort = (sort) => {
            setViewData({
                ...viewData,
                sort,
            });
        };
        newViewProxy.updateFilter = (filter) => {
            setViewData({
                ...viewData,
                filter,
            });
        };
        newViewProxy.updateGroup = (group) => {
            setViewData({
                ...viewData,
                group,
            });
        };
        newViewProxy.updateOption = (option) => {
            setViewData({
                ...viewData,
                options: {
                    ...(viewData?.options ?? {}),
                    ...option,
                },
            });
        };
        newViewProxy.updateColumnMeta = (columnMeta) => {
            const newViewData = {
                ...viewData,
                columnMeta: {
                    ...viewData.columnMeta,
                    ...columnMeta.reduce((acc, { fieldId, columnMeta }) => {
                        acc[fieldId] = {
                            ...viewData.columnMeta?.[fieldId],
                            ...columnMeta,
                        };
                        return acc;
                    }, {}),
                },
            };
            setViewData(newViewData);
        };
        setProxyView(newViewProxy);
    }, [viewData, view?.id]);
    return (_jsx(ViewContext.Provider, { value: { views: (proxyView ? [proxyView] : []) }, children: children }));
};
