import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useTranslation } from '../../../context/app/i18n';
import { BaseSingleSelect } from '../view-filter/component/base/BaseSingleSelect';
function ConjunctionSelect(props) {
    const { onSelect, value } = props;
    const { t } = useTranslation();
    const ConjunctionOptions = [
        {
            value: 'and',
            label: t('filter.conjunction.and'),
        },
        {
            value: 'or',
            label: t('filter.conjunction.or'),
        },
    ];
    return (_jsx(BaseSingleSelect, { value: value, onSelect: onSelect, className: cn('h-8 min-w-full shrink-0 p-1 text-[13px]'), search: false, popoverClassName: "w-15", options: ConjunctionOptions }));
}
export { ConjunctionSelect };
