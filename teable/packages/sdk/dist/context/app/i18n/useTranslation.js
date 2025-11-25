import { get, template } from 'lodash';
import { useCallback, useContext } from 'react';
import { AppContext } from '../AppContext';
export const useTranslation = () => {
    const { locale, lang } = useContext(AppContext);
    const t = useCallback((key, options) => {
        const translation = get(locale, key);
        if (!translation) {
            console.warn(`Translation for '${key}' not found.`);
        }
        if (options) {
            const compiled = template(translation, { interpolate: /\{\{([\s\S]+?)\}\}/g });
            return compiled(options);
        }
        return translation;
    }, [locale]);
    return {
        t,
        lang,
    };
};
