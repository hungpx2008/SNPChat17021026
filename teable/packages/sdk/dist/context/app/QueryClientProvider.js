import { jsx as _jsx } from "react/jsx-runtime";
import { Hydrate, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from './i18n';
import { createQueryClient } from './queryClient';
export const QueryClientProvider = (props) => {
    const { dehydratedState, children } = props;
    const { t } = useTranslation();
    const [queryClient] = useState(() => createQueryClient(t));
    return (_jsx(TanStackQueryClientProvider, { client: queryClient, children: _jsx(Hydrate, { state: dehydratedState, children: children }) }));
};
