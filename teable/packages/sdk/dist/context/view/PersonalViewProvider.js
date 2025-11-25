import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useContext, useMemo } from 'react';
import { useFields, useTableId, useTableListener, useView } from '../../hooks';
import { validatePersonalViewProps } from '../../utils/personalView';
import { ShareViewContext } from '../table';
import { PersonalViewContext } from './PersonalViewContext';
import { usePersonalViewStore } from './store';
export const PersonalViewProvider = ({ children }) => {
    const view = useView();
    const tableId = useTableId();
    const visibleFields = useFields();
    const fields = useFields({ withHidden: true, withDenied: true });
    const { shareId } = useContext(ShareViewContext) ?? {};
    const { personalViewMap, setPersonalViewMap } = usePersonalViewStore();
    const viewId = view?.id ?? '';
    const cachedView = personalViewMap?.[viewId];
    const isPersonalView = Boolean(cachedView);
    const visibleFieldIds = visibleFields.map(({ id }) => id);
    const { personalViewCommonQuery, personalViewAggregationQuery } = useMemo(() => {
        if (!cachedView || shareId) {
            return { personalViewCommonQuery: undefined, personalViewAggregationQuery: undefined };
        }
        const { filter, sort, group, columnMeta } = cachedView || {};
        const commonQuery = {
            ignoreViewQuery: true,
            filter,
            orderBy: sort?.sortObjs,
            groupBy: group,
            projection: visibleFieldIds,
        };
        const aggregationQuery = {
            ...commonQuery,
            field: Object.entries(columnMeta || {})
                .map(([fieldId, { statisticFunc }]) => {
                if (!statisticFunc)
                    return;
                return {
                    fieldId,
                    statisticFunc,
                };
            })
                .filter((item) => Boolean(item))
                .reduce((acc, { fieldId, statisticFunc }) => {
                if (!acc[statisticFunc]) {
                    acc[statisticFunc] = [];
                }
                acc[statisticFunc].push(fieldId);
                return acc;
            }, {}),
        };
        return {
            personalViewCommonQuery: commonQuery,
            personalViewAggregationQuery: aggregationQuery,
        };
    }, [cachedView, shareId, visibleFieldIds]);
    const updatePersonalView = useCallback((actionKey, payload) => {
        if (!payload)
            return;
        let newFields = fields;
        if (actionKey === 'setField') {
            const payloadField = payload.field;
            newFields = fields.map((field) => field.id === payloadField.id ? { ...field, ...payloadField } : field);
        }
        if (actionKey === 'addField') {
            const payloadField = payload.field;
            newFields = [...fields, payloadField];
        }
        if (actionKey === 'deleteField') {
            const payloadFieldId = payload.fieldId;
            newFields = fields.filter((field) => field.id !== payloadFieldId);
        }
        setPersonalViewMap(viewId, (prev) => validatePersonalViewProps(prev, newFields));
    }, [fields, viewId, setPersonalViewMap]);
    const tableMatches = useMemo(() => (isPersonalView ? ['setField', 'addField', 'deleteField'] : []), [isPersonalView]);
    useTableListener(tableId, tableMatches, updatePersonalView);
    return (_jsx(PersonalViewContext.Provider, { value: {
            isPersonalView,
            personalViewMap,
            personalViewCommonQuery,
            personalViewAggregationQuery,
        }, children: children }));
};
