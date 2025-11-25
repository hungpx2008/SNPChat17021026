import { useEffect, useRef } from 'react';
import { useDocumentVisible } from '../../hooks/use-document-visible';
export const isConnected = (socket) => {
    return [socket.OPEN, socket.CONNECTING].includes(socket.readyState);
};
export const useConnectionAutoManage = (connection, reconnect, { inactiveTimeout, reconnectDelay, } = {
    inactiveTimeout: 10 * 60 * 1000,
    reconnectDelay: 1000,
}) => {
    const visible = useDocumentVisible();
    const inactiveTimerRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const connectionRef = useRef(connection);
    useEffect(() => {
        connectionRef.current = connection;
    }, [connection]);
    useEffect(() => {
        const connection = connectionRef.current;
        if (!connection)
            return;
        if (inactiveTimerRef.current) {
            clearTimeout(inactiveTimerRef.current);
            inactiveTimerRef.current = null;
        }
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (visible && !isConnected(connection)) {
            reconnectTimerRef.current = setTimeout(() => {
                !isConnected(connection) && reconnect();
            }, reconnectDelay);
        }
        if (!visible && isConnected(connection)) {
            inactiveTimerRef.current = setTimeout(() => {
                isConnected(connection) && connection.close();
            }, inactiveTimeout);
        }
        return () => {
            if (inactiveTimerRef.current) {
                clearTimeout(inactiveTimerRef.current);
            }
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }
        };
    }, [visible, inactiveTimeout, reconnectDelay, reconnect]);
};
