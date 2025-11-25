import { getActionTriggerChannel } from '@teable/core';
import { useEffect, useMemo, useState } from 'react';
import { useConnection } from './use-connection';
export const usePresence = (channel) => {
    const { connection } = useConnection();
    const [presence, setPresence] = useState();
    useEffect(() => {
        if (connection == null || channel == null)
            return;
        const remotePresence = connection.getPresence(channel);
        if (!remotePresence.subscribed) {
            remotePresence.subscribe((err) => {
                err && console.error(err);
            });
        }
        setPresence(remotePresence);
        return () => {
            if (remotePresence.listenerCount('receive') === 0) {
                remotePresence.unsubscribe();
                remotePresence.destroy();
            }
        };
    }, [channel, connection]);
    return presence;
};
export const useActionListener = (tableIdOrViewId, matches, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
callback) => {
    const presence = usePresence(tableIdOrViewId && getActionTriggerChannel(tableIdOrViewId));
    const relevantProps = useMemo(() => new Set(matches), [matches]);
    useEffect(() => {
        if (!tableIdOrViewId || !presence)
            return;
        const cb = (_id, res) => {
            const result = res.find(({ actionKey }) => relevantProps.has(actionKey));
            if (result) {
                callback(result.actionKey, result.payload);
            }
        };
        presence.addListener('receive', cb);
        return () => {
            presence.removeListener('receive', cb);
        };
    }, [presence, tableIdOrViewId, callback, relevantProps]);
};
