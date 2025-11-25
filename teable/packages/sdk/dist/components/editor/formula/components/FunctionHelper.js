import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useTranslation } from '../../../../context/app/i18n';
import { useFormulaFunctionsMap } from '../constants';
export const FunctionHelper = (props) => {
    const { funcHelpData } = props;
    const { t } = useTranslation();
    const formulaFunctionMap = useFormulaFunctionsMap();
    if (funcHelpData == null)
        return null;
    const { funcName, focusParamIndex } = funcHelpData;
    const helpFunc = formulaFunctionMap.get(funcName);
    if (helpFunc == null)
        return null;
    const focusIndex = focusParamIndex >= helpFunc.params.length ? helpFunc.params.length - 1 : focusParamIndex;
    return (_jsxs(_Fragment, { children: [_jsxs("code", { className: "flex text-xs", children: [`${funcHelpData.funcName}(`, helpFunc.params.map((param, index) => {
                        const isHighlight = index === focusIndex;
                        return (_jsxs("span", { children: [index > 0 ? ', ' : null, _jsx("span", { className: cn('p-[2px]', isHighlight && 'bg-amber-400 rounded'), children: param })] }, index));
                    }), ')'] }), _jsxs("code", { className: "mt-[2px] text-xs text-slate-400", children: [t('editor.formula.helperExample'), helpFunc.example.split('\n')[0]] })] }));
};
