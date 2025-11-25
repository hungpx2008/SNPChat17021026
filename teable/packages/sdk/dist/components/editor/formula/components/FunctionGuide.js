import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '@teable/next-themes';
import { cn } from '@teable/ui-lib';
import { useTranslation } from '../../../../context/app/i18n';
export const FunctionGuide = (props) => {
    const { data } = props;
    const { resolvedTheme } = useTheme();
    const { t } = useTranslation();
    if (data == null)
        return null;
    const codeBg = resolvedTheme === 'light' ? 'bg-slate-100' : 'bg-gray-900';
    return (_jsx("div", { className: "w-full overflow-y-auto", children: _jsxs("div", { className: "grow px-4 py-2", children: [_jsx("h2", { className: "text-lg", children: data.name }), _jsx("div", { className: "text-[13px] text-gray-400", children: data.summary }), data.definition && (_jsxs(_Fragment, { children: [_jsx("h3", { className: "mt-4 text-sm", children: t('editor.formula.guideSyntax') }), _jsx("code", { className: cn('flex mt-2 p-3 w-full rounded text-[13px] whitespace-pre-wrap', codeBg), children: data.definition })] })), data.example && (_jsxs(_Fragment, { children: [_jsx("h3", { className: "mt-4 text-sm", children: t('editor.formula.guideExample') }), _jsx("code", { className: cn('flex mt-2 p-3 w-full rounded text-[13px] whitespace-pre-wrap', codeBg), children: data.example })] }))] }) }));
};
