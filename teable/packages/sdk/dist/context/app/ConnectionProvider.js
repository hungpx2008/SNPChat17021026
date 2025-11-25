import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { ConnectionContext } from './ConnectionContext';
import { useConnection } from './useConnection';
export const ConnectionProvider = ({ children, wsPath }) => {
    const { connected, connection } = useConnection(wsPath);
    const value = useMemo(() => {
        return { connection, connected };
    }, [connection, connected]);
    return _jsx(ConnectionContext.Provider, { value: value, children: children });
};
