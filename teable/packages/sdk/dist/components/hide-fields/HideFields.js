import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { difference, map } from 'lodash';
import { useTranslation } from '../../context/app/i18n';
import { useViewId, useFields, useView } from '../../hooks';
import { swapReorder } from '../../utils';
import { HideFieldsBase } from './HideFieldsBase';
export const HideFields = ({ footer, children }) => {
    const activeViewId = useViewId();
    const fields = useFields({ withHidden: true, withDenied: true });
    const view = useView();
    const { t } = useTranslation();
    const filterFields = (fields, shouldBeHidden) => fields.filter(({ id }) => activeViewId && (!shouldBeHidden || view?.columnMeta?.[id]?.hidden === shouldBeHidden));
    const fieldData = filterFields(fields);
    const hiddenFieldIds = map(filterFields(fields, true), 'id');
    const hiddenCount = hiddenFieldIds.length;
    const onChange = (hidden) => {
        if (!activeViewId) {
            return;
        }
        const hiddenIds = difference(hidden, hiddenFieldIds);
        const showIds = difference(hiddenFieldIds, hidden);
        if (view) {
            hiddenIds.length &&
                view.updateColumnMeta(hiddenIds.map((id) => ({ fieldId: id, columnMeta: { hidden: true } })));
            showIds.length &&
                view.updateColumnMeta(showIds.map((id) => ({ fieldId: id, columnMeta: { hidden: false } })));
        }
    };
    const onOrderChange = (fieldId, fromIndex, toIndex) => {
        if (!view)
            return;
        const newOrder = swapReorder(1, fromIndex, toIndex, fields.length, (index) => {
            const fieldId = fields[index].id;
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
        return _jsx(_Fragment, {});
    }
    return (_jsx(HideFieldsBase, { footer: footer, fields: fieldData, hidden: hiddenFieldIds, onChange: onChange, onOrderChange: onOrderChange, children: children(hiddenCount ? t('hidden.configLabel_other', { count: hiddenCount }) : t('hidden.label'), Boolean(hiddenCount)) }));
};
