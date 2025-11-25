import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from '@teable/icons';
import { Button, cn } from '@teable/ui-lib';
import { produce } from 'immer';
import { set, get } from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { Condition } from './condition';
import { BaseFilterContext } from './context';
import { useControllableState } from './hooks';
const DEFAULT_VALUE = {
    conjunction: 'and',
    children: [],
};
export const BaseFilter = (props) => {
    const { t } = useTranslation();
    const { onChange, maxDepth = 2, defaultValue = DEFAULT_VALUE, value: valueProp = DEFAULT_VALUE, defaultItemValue, defaultGroupValue: defaultGroupValueFromProps, footerClassName, contentClassName, } = props;
    const [value, setValue] = useControllableState({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: onChange,
    });
    const { conjunction, children } = valueProp;
    const defaultGroupValue = useMemo(() => defaultGroupValueFromProps || {
        conjunction: 'and',
        children: [],
    }, [defaultGroupValueFromProps]);
    const filterContainerRef = useRef(null);
    const createCondition = useCallback((path, type) => {
        const newFilter = produce(value, (draft) => {
            const target = get(draft, path);
            target.push(type === 'item' ? { ...defaultItemValue } : { ...defaultGroupValue });
        });
        setValue(newFilter);
    }, [defaultGroupValue, defaultItemValue, setValue, value]);
    const onChangeHandler = useCallback((path, newValue) => {
        if (value) {
            const newFilter = produce(value, (draft) => {
                set(draft, path, newValue);
            });
            setValue(newFilter);
        }
    }, [setValue, value]);
    const onDeleteHandler = useCallback((path) => {
        const parentPath = path.slice(0, -1);
        const index = path.slice(-1);
        if (value && index !== undefined && parentPath) {
            const newFilter = produce(value, (draft) => {
                const target = parentPath.length ? get(draft, parentPath) : draft;
                target.splice(index, 1);
            });
            setValue(newFilter);
        }
    }, [setValue, value]);
    const footer = (_jsxs("div", { role: "button", tabIndex: -1, onKeyDown: (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                e.preventDefault();
            }
        }, className: cn('flex justify-start gap-1', footerClassName), onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
            setTimeout(() => {
                filterContainerRef?.current?.scrollTo({
                    top: filterContainerRef?.current?.scrollHeight,
                    behavior: 'smooth',
                });
            }, 0);
        }, children: [_jsxs(Button, { variant: "ghost", size: "xs", onClick: () => {
                    setValue({
                        conjunction: valueProp.conjunction,
                        children: [
                            ...children,
                            defaultItemValue
                                ? { ...defaultItemValue }
                                : { field: null, operator: null, value: null },
                        ],
                    });
                }, children: [_jsx(Plus, {}), t('filter.addCondition')] }), _jsxs(Button, { variant: "ghost", size: "xs", onClick: () => {
                    setValue({
                        conjunction: valueProp.conjunction,
                        children: [...children, { ...defaultGroupValue }],
                    });
                }, children: [_jsx(Plus, {}), t('filter.addConditionGroup')] })] }));
    return (_jsxs(BaseFilterContext.Provider, { value: {
            maxDepth: maxDepth,
            onChange: onChangeHandler,
            onDelete: onDeleteHandler,
            createCondition: createCondition,
            getValue: () => value,
            component: props.components,
        }, children: [children.length > 0 && (_jsx("div", { className: cn('flex flex-1 flex-col overflow-auto', contentClassName), ref: filterContainerRef, children: children.map((condition, index) => (_jsx(Condition, { index: index, value: condition, path: ['children', index], depth: 0, conjunction: conjunction }, index))) })), footer] }));
};
export const BaseFilterFooter = (props) => {
    return _jsx("div", { children: props.children });
};
