import { useMutation } from '@tanstack/react-query';
import { getTableButtonClickChannel } from '@teable/core';
import { buttonClick as buttonClickApi } from '@teable/openapi/src/record/button-click';
import { shareViewButtonClick as shareViewButtonClickApi } from '@teable/openapi/src/share/view-button-click';
import { sonner } from '@teable/ui-lib';
import { isEmpty, get } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../context/app/i18n';
import { useConnection } from './use-connection';
const { toast } = sonner;
export const useButtonClickStatus = (tableId, shareId) => {
    const { connection } = useConnection();
    const channel = getTableButtonClickChannel(tableId);
    const presence = connection?.getPresence(channel);
    // runId => status
    const [statusMap, setStatusMap] = useState({});
    const toastMapRef = useRef({});
    const complatedMapRef = useRef({});
    const { t } = useTranslation();
    const { mutateAsync: buttonClickFn } = useMutation({
        mutationFn: (ro) => shareId
            ? shareViewButtonClickApi(shareId, ro.recordId, ro.fieldId)
            : buttonClickApi(ro.tableId, ro.recordId, ro.fieldId),
        onSuccess: (res, ro) => {
            setStatus({
                runId: res.data.runId,
                recordId: ro.recordId,
                fieldId: ro.fieldId,
                loading: !!res.data.runId,
                name: ro.name,
            });
        },
        onError: (_error, ro) => {
            setComplated({
                runId: '',
                recordId: ro.recordId,
                fieldId: ro.fieldId,
                loading: false,
                name: ro.name,
            });
        },
    });
    const checkLoading = useCallback((fieldId, recordId) => {
        return statusMap[`${recordId}-${fieldId}`]?.loading ?? false;
    }, [statusMap]);
    const setRunning = useCallback((status) => {
        const { runId, loading, name, recordId, fieldId } = status;
        setStatusMap((prev) => ({
            ...prev,
            [`${recordId}-${fieldId}`]: status,
        }));
        if (!runId) {
            return;
        }
        const toastId = toastMapRef.current[runId];
        if (loading) {
            const newToastId = toast.loading(t('common.runStatus.running', { name }), {
                id: toastId ?? undefined,
            });
            toastMapRef.current[runId] = newToastId;
        }
    }, [t]);
    const setComplated = useCallback((status) => {
        const { runId, recordId, fieldId, errorMessage, name } = status;
        setStatusMap((prev) => {
            const newMap = { ...prev };
            delete newMap[`${recordId}-${fieldId}`];
            return newMap;
        });
        if (!runId) {
            return;
        }
        complatedMapRef.current[runId] = true;
        const toastId = toastMapRef.current[runId];
        if (!toastId) {
            return;
        }
        delete toastMapRef.current[runId];
        if (errorMessage) {
            toast.error(t('common.runStatus.failed', { name }), {
                id: toastId,
            });
        }
        else {
            toast.success(t('common.runStatus.success', { name }), {
                id: toastId,
            });
        }
    }, [setStatusMap, t]);
    /**
     * socket may fast then http, so we need to check isComplated
     */
    const setStatus = useCallback((status) => {
        const { loading, runId, name } = status;
        const isComplated = complatedMapRef.current[runId];
        if (isComplated) {
            toast.success(t('common.runStatus.success', { name }));
            delete complatedMapRef.current[runId];
        }
        else if (loading) {
            setRunning(status);
        }
        else {
            setComplated(status);
        }
    }, [setComplated, setRunning, t]);
    useEffect(() => {
        if (!presence || !channel) {
            return;
        }
        if (presence.subscribed) {
            return;
        }
        presence.subscribe();
        const receiveHandler = () => {
            const { remotePresences } = presence;
            if (!isEmpty(remotePresences)) {
                const remoteStatus = get(remotePresences, channel);
                if (remoteStatus) {
                    setComplated(remoteStatus);
                }
            }
        };
        presence.on('receive', receiveHandler);
        return () => {
            presence?.removeListener('receive', receiveHandler);
            presence?.listenerCount('receive') === 0 && presence?.unsubscribe();
            presence?.listenerCount('receive') === 0 && presence?.destroy();
        };
    }, [connection, presence, channel, setComplated]);
    const buttonClick = useCallback((ro) => {
        setRunning({
            runId: '',
            recordId: ro.recordId,
            fieldId: ro.fieldId,
            loading: true,
            name: ro.name,
        });
        return buttonClickFn(ro);
    }, [buttonClickFn, setRunning]);
    return useMemo(() => {
        return { checkLoading, buttonClick };
    }, [checkLoading, buttonClick]);
};
