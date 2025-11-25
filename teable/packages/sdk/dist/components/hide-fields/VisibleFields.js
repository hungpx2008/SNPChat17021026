import { jsx as _jsx } from "react/jsx-runtime";
import { difference } from 'lodash';
import { useMemo } from 'react';
import { useViewId, useFields, useView } from '../../hooks';
import { swapReorder } from '../../utils';
import { HideFieldsBase } from './HideFieldsBase';
export const VisibleFields = ({ footer, children }) => {
    const activeViewId = useViewId();
    const totalFields = useFields({ withHidden: true, withDenied: true });
    const view = useView();
    const columnMeta = view?.columnMeta;
    const hiddenFieldIds = useMemo(() => totalFields
        .filter(({ id, isPrimary }) => !isPrimary &&
        !(columnMeta?.[id]?.visible === undefined ? true : columnMeta?.[id]?.visible))
        .map(({ id }) => id), [totalFields, columnMeta]);
    const hiddenCount = hiddenFieldIds.length;
    const onChange = (hidden) => {
        if (!activeViewId) {
            return;
        }
        const hiddenIds = difference(hidden, hiddenFieldIds);
        const showIds = difference(hiddenFieldIds, hidden);
        if (view) {
            hiddenIds.length &&
                view.updateColumnMeta(hiddenIds.map((id) => ({ fieldId: id, columnMeta: { visible: false } })));
            showIds.length &&
                view.updateColumnMeta(showIds.map((id) => ({ fieldId: id, columnMeta: { visible: true } })));
        }
    };
    const onOrderChange = (fieldId, fromIndex, toIndex) => {
        if (!view)
            return;
        const newOrder = swapReorder(1, fromIndex, toIndex, totalFields.length, (index) => {
            const fieldId = totalFields[index].id;
            return view?.columnMeta[fieldId].order;
        })[0];
        if (newOrder === view?.columnMeta[fieldId].order) {
            return;
        }
        view.updateColumnMeta([
            {
                fieldId,
                columnMeta: {
                    order: newOrder,
                },
            },
        ]);
    };
    if (!activeViewId) {
        return null;
    }
    return (_jsx(HideFieldsBase, { footer: footer, fields: totalFields, hidden: hiddenFieldIds, onChange: onChange, onOrderChange: onOrderChange, children: children(hiddenCount ? `${hiddenCount} hidden field(s)` : 'Hide fields', Boolean(hiddenCount)) }));
};
