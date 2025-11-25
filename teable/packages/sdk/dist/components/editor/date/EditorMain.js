import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { TimeFormatting } from '@teable/core';
import { Button, Calendar, cn, Input, NavView } from '@teable/ui-lib';
import { enUS, zhCN, ja, ru, fr } from 'date-fns/locale';
import { formatInTimeZone, toDate, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { forwardRef, useContext, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AppContext } from '../../../context';
import { useTranslation } from '../../../context/app/i18n';
// Remember to update in @nextjs-app/src/features/app/blocks/view/calendar/components/Calendar.tsx
const LOCAL_MAP = {
    zh: zhCN,
    en: enUS,
    ja: ja,
    ru: ru,
    fr: fr,
};
const DateEditorMainBase = (props, ref) => {
    const { value, style, className, onChange, readonly, options, disableTimePicker = false } = props;
    const inputRef = useRef(null);
    const { time, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone } = options?.formatting || {};
    const [date, setDate] = useState(value || null);
    const [navView, setNavView] = useState(NavView.Day);
    const notHaveTimePicker = disableTimePicker || time === TimeFormatting.None;
    const defaultFocusRef = useRef(null);
    const { lang = 'en' } = useContext(AppContext);
    const { t } = useTranslation();
    useImperativeHandle(ref, () => ({
        focus: () => defaultFocusRef.current?.focus?.(),
        setValue: (value) => setDate(value || null),
        saveValue,
    }));
    const onSelect = (value) => {
        if (!value)
            return onChange?.(null);
        const curDatetime = fromZonedTime(value, timeZone);
        if (date) {
            const prevDatetime = toDate(date, { timeZone });
            curDatetime.setHours(prevDatetime.getHours());
            curDatetime.setMinutes(prevDatetime.getMinutes());
            curDatetime.setSeconds(prevDatetime.getSeconds());
        }
        else {
            const tempDate = now();
            curDatetime.setHours(tempDate.getHours());
            curDatetime.setMinutes(tempDate.getMinutes());
            curDatetime.setSeconds(tempDate.getSeconds());
        }
        const dateStr = curDatetime.toISOString();
        setDate(dateStr);
        onChange?.(dateStr);
    };
    const timeValue = useMemo(() => {
        if (!date)
            return '';
        return formatInTimeZone(date, timeZone, 'HH:mm');
    }, [date, timeZone]);
    const selectedDate = useMemo(() => {
        if (!date) {
            return;
        }
        return toZonedTime(date, timeZone);
    }, [date, timeZone]);
    const onTimeChange = (e) => {
        if (!date)
            return;
        const datetime = toZonedTime(date, timeZone);
        const timeValue = e.target.value;
        const hours = Number.parseInt(timeValue.split(':')[0] || '00', 10);
        const minutes = Number.parseInt(timeValue.split(':')[1] || '00', 10);
        datetime.setHours(hours);
        datetime.setMinutes(minutes);
        setDate(fromZonedTime(datetime, timeZone).toISOString());
    };
    const saveValue = (nowDate) => {
        const val = nowDate || date;
        if (value == val)
            return;
        setDate(val);
        onChange?.(val);
    };
    const now = () => {
        return fromZonedTime(new Date(), timeZone);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Calendar, { locale: LOCAL_MAP[lang], style: style, mode: "single", timeZone: timeZone, selected: selectedDate, defaultMonth: selectedDate, onSelect: onSelect, className: className, disabled: readonly, footer: _jsxs("div", { className: cn('flex items-center justify-center p-1', navView === NavView.Year && 'hidden'), children: [!notHaveTimePicker && date ? (_jsx(Input, { className: "mr-3 w-7/12", ref: inputRef, type: "time", value: timeValue, onChange: onTimeChange, onBlur: () => saveValue() })) : null, _jsx(Button, { className: "h-[34px] w-2/5 text-sm", size: "sm", onClick: () => {
                                saveValue(now().toISOString());
                            }, children: t('editor.date.today') })] }), onNavViewChange: (navView) => setNavView(navView) }), _jsx("input", { className: "absolute size-0 opacity-0", ref: defaultFocusRef })] }));
};
export const DateEditorMain = forwardRef(DateEditorMainBase);
