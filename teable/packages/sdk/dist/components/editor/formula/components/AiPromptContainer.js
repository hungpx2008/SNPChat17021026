import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MagicAi, Code, ChevronRight, AlertCircle, Edit } from '@teable/icons';
import { getFormulaPrompt } from '@teable/openapi';
import { Textarea, cn, Button, ScrollArea } from '@teable/ui-lib';
import { TerminalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../../../context/app/i18n';
import { useFields } from '../../../../hooks';
import { useAIStream } from '../../../../hooks/use-ai';
export const AiPromptContainer = (props) => {
    const { onApply } = props;
    const { t } = useTranslation();
    const fields = useFields({ withHidden: true, withDenied: true });
    const { generateAIResponse, text, loading, error } = useAIStream();
    const [prompt, setPrompt] = useState('');
    const [generatedExpression, setGeneratedExpression] = useState(text);
    useEffect(() => {
        if (text) {
            setGeneratedExpression(text);
        }
    }, [text]);
    const onExpressionGenerate = () => {
        if (!prompt)
            return;
        generateAIResponse(getFormulaPrompt(prompt, fields));
    };
    const handleApplyAiFormula = () => {
        if (!generatedExpression)
            return;
        onApply(generatedExpression);
    };
    return (_jsxs("div", { className: "grid h-[360px] grid-cols-2 gap-x-4 p-4", children: [_jsxs("div", { className: "relative flex h-full flex-col overflow-hidden rounded-lg border", children: [_jsxs("div", { className: "flex h-9 items-center gap-2 border-b px-4", children: [_jsx(Edit, { className: "size-4 text-gray-700 dark:text-gray-400" }), _jsx("span", { className: "text-xs font-medium", children: t('editor.formula.inputPrompt') })] }), _jsxs("div", { className: "flex grow flex-col gap-y-4 p-4", children: [_jsx(Textarea, { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: t('editor.formula.placeholderForAIPrompt'), className: "grow resize-none" }), _jsxs(Button, { variant: "outline", onClick: onExpressionGenerate, className: "group relative w-full overflow-hidden", disabled: !prompt || loading, size: "sm", children: [_jsx(MagicAi, { className: cn('size-4 text-gray-700 dark:text-gray-400', loading && 'animate-pulse') }), loading ? t('editor.formula.action.generating') : t('editor.formula.action.generate')] })] })] }), _jsxs("div", { className: "relative flex h-full flex-col overflow-hidden rounded-lg border", children: [_jsxs("div", { className: "flex h-9 shrink-0 items-center gap-2 border-b px-4", children: [_jsx(Code, { className: "size-4 text-gray-700 dark:text-gray-400" }), _jsx("span", { className: "text-xs font-medium", children: t('editor.formula.generateExpression') })] }), _jsx("div", { className: "grow p-4", children: !error ? (loading && !generatedExpression ? (_jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-y-6", children: [_jsxs("div", { className: "relative flex size-16 items-center justify-center rounded-full", children: [_jsx("div", { className: "absolute inset-0 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700" }), _jsx(MagicAi, { className: "size-6 animate-pulse text-gray-700 dark:text-gray-400" })] }), _jsx("p", { className: "text-center text-sm text-gray-600", children: t('editor.formula.generatingByAI') })] })) : generatedExpression ? (_jsxs("div", { className: "flex h-full flex-col gap-y-4", children: [_jsxs("div", { className: "relative grow rounded-md border bg-slate-100 p-3 font-mono dark:bg-zinc-900", children: [_jsx("div", { className: "absolute right-2 top-2 rounded-md border px-2 py-0.5 font-sans text-xs text-gray-500", children: t('field.title.formula') }), _jsx(ScrollArea, { className: "mt-6 h-40", children: _jsx("div", { className: "text-[13px]", children: generatedExpression }) })] }), _jsx(Button, { size: "sm", variant: "outline", className: "group shrink-0", onClick: handleApplyAiFormula, children: _jsxs("span", { className: "flex items-center", children: [t('editor.formula.action.apply'), _jsx(ChevronRight, { className: "ml-1 size-4 transition-transform group-hover:translate-x-1" })] }) })] })) : (_jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-6", children: [_jsx("div", { className: "flex size-16 items-center justify-center rounded-full border border-gray-200", children: _jsx(TerminalIcon, { className: "size-6 text-gray-400" }) }), _jsx("p", { className: "max-w-[200px] text-center text-xs text-gray-400", children: t('editor.formula.generatedExpressionTips') })] }))) : (_jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-6", children: [_jsx(AlertCircle, { className: "size-16 text-destructive" }), _jsx("p", { className: "max-w-[200px] text-center text-xs text-destructive", children: error })] })) })] })] }));
};
