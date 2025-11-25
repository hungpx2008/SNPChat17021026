import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider } from '@teable/next-themes';
import { isObject, merge } from 'lodash';
import { useMemo } from 'react';
import { AppContext } from '../app/AppContext';
import { ConnectionProvider } from './ConnectionProvider';
import { defaultLocale } from './i18n';
import { QueryClientProvider } from './QueryClientProvider';
export const AppProvider = (props) => {
    const { forcedTheme, children, wsPath, lang, locale, disabledWs, dehydratedState } = props;
    const value = useMemo(() => {
        return {
            lang,
            locale: isObject(locale) ? merge(defaultLocale, locale) : defaultLocale,
        };
    }, [lang, locale]);
    if (disabledWs) {
        return (_jsx(ThemeProvider, { attribute: "class", forcedTheme: forcedTheme, children: _jsx(AppContext.Provider, { value: value, children: _jsx(QueryClientProvider, { dehydratedState: dehydratedState, children: children }) }) }));
    }
    // forcedTheme is not work as expected https://github.com/pacocoursey/next-themes/issues/252
    return (_jsx(ThemeProvider, { attribute: "class", forcedTheme: forcedTheme, children: _jsx(AppContext.Provider, { value: value, children: _jsx(ConnectionProvider, { wsPath: wsPath, children: _jsx(QueryClientProvider, { dehydratedState: dehydratedState, children: children }) }) }) }));
};
