import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from '@teable/icons';
import { Button, cn } from '@teable/ui-lib';
import { useState } from 'react';
import { useTranslation } from '../../../../context/app/i18n';
export const RowCounter = (props) => {
    const { rowCount, className } = props;
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const onClick = () => {
        setCollapsed(!collapsed);
    };
    const Icon = collapsed ? ChevronRight : ChevronLeft;
    return (_jsxs("div", { className: cn('flex items-center h-6 pl-2 ml-1 text-xs bg-violet-200 dark:bg-zinc-600 rounded', className), children: [collapsed ? rowCount : t('common.rowCount', { count: rowCount }), _jsx(Button, { variant: 'ghost', size: 'xs', className: "ml-[2px] h-full rounded-l-none p-[2px] hover:bg-violet-300 dark:hover:bg-zinc-500", onClick: onClick, children: _jsx(Icon, { className: "size-3" }) })] }));
};
