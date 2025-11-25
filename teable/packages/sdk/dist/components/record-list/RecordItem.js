import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useTranslation } from '../../context/app/i18n';
export const RecordItem = (props) => {
    const { active, title, className } = props;
    const { t } = useTranslation();
    return (_jsx("div", { tabIndex: -1, role: 'button', className: cn('group relative w-full cursor-pointer truncate rounded-md border border-input px-4 py-2 shadow-sm', {
            'border-l-8 border-l-foreground': active,
        }, className), children: _jsx("div", { className: "w-full truncate font-mono text-sm", title: title?.replaceAll('\n', ' ') || t('common.unnamedRecord'), children: title?.replaceAll('\n', ' ') || t('common.unnamedRecord') }) }));
};
