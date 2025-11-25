import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useTranslation } from '../../../context/app/i18n';
import { useCrud } from '../hooks';
import { ConjunctionSelect } from './ConjunctionSelect';
var ConjunctionPosition;
(function (ConjunctionPosition) {
    ConjunctionPosition[ConjunctionPosition["WHERE"] = 0] = "WHERE";
    ConjunctionPosition[ConjunctionPosition["SELECTOR"] = 1] = "SELECTOR";
    ConjunctionPosition[ConjunctionPosition["JOIN"] = 2] = "JOIN";
})(ConjunctionPosition || (ConjunctionPosition = {}));
const Conjunction = (props) => {
    const { t } = useTranslation();
    const { onChange } = useCrud();
    const { index, value, path } = props;
    const onChangeConjunctionHandler = (val) => {
        const conjunctionPath = path.slice(0, -3).concat('conjunction');
        onChange(conjunctionPath, val);
    };
    return (_jsxs("div", { className: cn('flex shrink-0 justify-start min-w-16 box-border'), children: [index === ConjunctionPosition.WHERE ? (_jsx("span", { className: "px-1 text-sm leading-9", children: t('filter.conjunction.where') })) : null, index === ConjunctionPosition.SELECTOR ? (_jsx(ConjunctionSelect, { value: value, onSelect: onChangeConjunctionHandler })) : null, index >= ConjunctionPosition.JOIN ? (_jsx("span", { className: "px-1 text-[13px] leading-9", children: value === 'or' ? t('filter.conjunction.or') : t('filter.conjunction.and') })) : null] }));
};
export { Conjunction };
