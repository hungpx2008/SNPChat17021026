import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from '@teable/icons';
import { Button, cn } from '@teable/ui-lib';
import { noop } from 'lodash';
import { useTranslation } from '../../../context/app/i18n';
export const LinkCard = (props) => {
    const { title, readonly, className, wrapClassName, onClick, onDelete } = props;
    const { t } = useTranslation();
    return (_jsxs("div", { tabIndex: -1, role: 'button', className: cn('group relative w-full cursor-pointer rounded-md border px-4 py-2 shadow-sm', wrapClassName), onClick: readonly ? undefined : onClick, onKeyDown: noop, children: [_jsx("div", { className: cn('w-full font-mono text-sm', className), title: title || t('common.unnamedRecord'), children: title || t('common.unnamedRecord') }), !readonly && (_jsx(Button, { className: "absolute right-0 top-0 size-4 -translate-y-1/2 translate-x-1/2 rounded-full md:opacity-0 md:group-hover:opacity-100", size: 'icon', tabIndex: -1, onClick: (e) => {
                    e.stopPropagation();
                    onDelete?.();
                }, children: _jsx(X, {}) }))] }));
};
