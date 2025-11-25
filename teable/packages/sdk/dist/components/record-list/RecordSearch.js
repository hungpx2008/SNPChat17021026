import { jsx as _jsx } from "react/jsx-runtime";
import { Input, cn } from '@teable/ui-lib';
import { forwardRef } from 'react';
import { useTranslation } from '../../context/app/i18n';
export const RecordSearch = forwardRef(({ className, type, placeholder, ...props }, ref) => {
    const { t } = useTranslation();
    return (_jsx("div", { className: "relative p-0.5", children: _jsx(Input, { ref: ref, type: type, className: cn('h-8', className), placeholder: placeholder || t('editor.link.searchPlaceholder'), ...props }) }));
});
RecordSearch.displayName = 'RecordSearch';
