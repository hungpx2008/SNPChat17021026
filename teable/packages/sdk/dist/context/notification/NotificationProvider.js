import { jsx as _jsx } from "react/jsx-runtime";
import { getUserNotificationChannel } from '@teable/core';
import { useEffect, useState } from 'react';
import { useSession } from '../../hooks';
import { useConnection } from '../../hooks/use-connection';
import { NotificationContext } from './NotificationContext';
export const NotificationProvider = ({ children }) => {
    const { user } = useSession();
    const { connection } = useConnection();
    const [remotePresence, setRemotePresence] = useState();
    const [notification, setNotification] = useState(null);
    useEffect(() => {
        if (!connection) {
            return;
        }
        const channel = getUserNotificationChannel(user.id);
        setRemotePresence(connection.getPresence(channel));
        remotePresence?.subscribe((err) => err && console.error);
        const receiveHandler = (_id, res) => {
            setNotification(res);
        };
        remotePresence?.on('receive', receiveHandler);
        return () => {
            remotePresence?.removeListener('receive', receiveHandler);
            remotePresence?.unsubscribe();
            remotePresence?.destroy();
        };
    }, [connection, remotePresence, user.id]);
    return (_jsx(NotificationContext.Provider, { value: notification, children: children }));
};
