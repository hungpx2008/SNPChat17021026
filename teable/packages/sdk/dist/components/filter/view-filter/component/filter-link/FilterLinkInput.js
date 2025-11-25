import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useTranslation } from '../../../../../context/app/i18n';
import { FilterInput } from '../FilterInput';
export const FilterLinkInput = (props) => {
    const { value, onSelect, className } = props;
    const { t } = useTranslation();
    return (_jsx(FilterInput, { placeholder: t('filter.linkInputPlaceholder'), value: value, onChange: onSelect, className: cn('w-40', className) }));
};
