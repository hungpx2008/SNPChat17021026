import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { sonner } from '@teable/ui-lib';
import { UsageLimitModalType, useUsageLimitModalStore, } from '../../components/billing/store/usage-limit-modal';
const { toast } = sonner;
export function toCamelCaseErrorCode(errorCode) {
    return errorCode
        .split('_')
        .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
        .join('');
}
export const getLocalizationMessage = (localization, t, prefix) => {
    const { i18nKey, context } = localization;
    const key = prefix ? `${prefix}:${i18nKey}` : i18nKey;
    return i18nKey ? t(key, context ?? {}) : '';
};
export const getHttpErrorMessage = (error, t, prefix) => {
    const { message, data } = error;
    const { localization } = data || {};
    return localization ? getLocalizationMessage(localization, t, prefix) : message;
};
export const errorRequestHandler = (error, t) => {
    const { code, message, status } = error;
    // no authentication
    if (status === 401) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.href)}`;
        return;
    }
    if (status === 402) {
        useUsageLimitModalStore.setState({ modalType: UsageLimitModalType.Upgrade, modalOpen: true });
        return;
    }
    if (status === 460) {
        useUsageLimitModalStore.setState({ modalType: UsageLimitModalType.User, modalOpen: true });
        return;
    }
    if (t) {
        const description = getHttpErrorMessage(error, t);
        return toast.error(code
            ? t(`httpErrors.${toCamelCaseErrorCode(code)}`)
            : t('httpErrors.unknownErrorCode'), {
            description,
        });
    }
    toast.error(code || 'Unknown Error', {
        description: message,
    });
};
export const createQueryClient = (t) => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 10 * 1000,
                retry: false,
                networkMode: 'always',
            },
            mutations: {
                networkMode: 'always',
            },
        },
        queryCache: new QueryCache({
            onError: (error, query) => {
                if (query.meta?.['preventGlobalError']) {
                    return;
                }
                errorRequestHandler(error, t);
            },
        }),
        mutationCache: new MutationCache({
            onError: (error, _variables, _context, mutation) => {
                if (mutation.options.meta?.['preventGlobalError']) {
                    return;
                }
                errorRequestHandler(error, t);
            },
        }),
    });
};
