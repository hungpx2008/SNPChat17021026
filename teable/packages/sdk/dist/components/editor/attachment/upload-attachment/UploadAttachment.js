import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, } from '@dnd-kit/sortable';
import { generateAttachmentId } from '@teable/core';
import { UploadType } from '@teable/openapi';
import { FilePreviewProvider, Progress, cn, sonner } from '@teable/ui-lib';
import { map, omit } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../../../../context/app/i18n';
import { useBaseId } from '../../../../hooks';
import { UsageLimitModalType, useUsageLimitModalStore } from '../../../billing/store';
import { FileZone } from '../../../FileZone';
import { useAttachmentPreviewI18Map } from '../../../hooks';
import { getFileCover } from '../utils';
import AttachmentItem from './AttachmentItem';
import { FileInput } from './FileInput';
import { AttachmentManager } from './uploadManage';
const { toast } = sonner;
const defaultAttachmentManager = new AttachmentManager(2);
export const UploadAttachment = (props) => {
    const { className, attachments, onChange, readonly, attachmentManager = defaultAttachmentManager, } = props;
    const baseId = useBaseId();
    const [sortData, setSortData] = useState([...attachments]);
    const [uploadingFiles, setUploadingFiles] = useState({});
    const listRef = useRef(null);
    const attachmentsRef = useRef(attachments);
    const [newAttachments, setNewAttachments] = useState([]);
    const { t } = useTranslation();
    const i18nMap = useAttachmentPreviewI18Map();
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 },
    }), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    attachmentsRef.current = attachments;
    useEffect(() => {
        if (newAttachments.length && newAttachments.length === Object.keys(uploadingFiles).length) {
            onChange?.(attachmentsRef.current.concat(newAttachments));
            setNewAttachments([]);
            setUploadingFiles({});
        }
    }, [newAttachments, onChange, uploadingFiles]);
    const onDelete = (id) => {
        const finalAttachments = attachments.filter((attachment) => attachment.id !== id);
        onChange?.(!finalAttachments.length ? null : finalAttachments);
    };
    const downloadFile = ({ presignedUrl, name }) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = presignedUrl || '';
        downloadLink.target = '_blank';
        downloadLink.download = name;
        downloadLink.click();
    };
    const handleSuccess = useCallback((file, attachment) => {
        const { id, instance } = file;
        const newAttachment = {
            id,
            name: instance.name,
            ...omit(attachment, ['url']),
        };
        setNewAttachments((pre) => [...pre, newAttachment]);
    }, []);
    const uploadAttachment = useCallback((files) => {
        const uploadList = files.map((v) => ({ instance: v, id: generateAttachmentId() }));
        const newUploadMap = uploadList.reduce((acc, file) => {
            acc[file.id] = { progress: 0, file: file.instance };
            return acc;
        }, {});
        attachmentManager.upload(uploadList, UploadType.Table, {
            successCallback: handleSuccess,
            errorCallback: (file, error, code) => {
                const curUploadingFiles = { ...uploadingFiles };
                delete curUploadingFiles[file.id];
                setUploadingFiles(curUploadingFiles);
                if (code === 402) {
                    return useUsageLimitModalStore.setState({
                        modalType: UsageLimitModalType.Upgrade,
                        modalOpen: true,
                    });
                }
                toast.error(error ?? t('common.uploadFailed'));
            },
            progressCallback: (file, progress) => {
                setUploadingFiles((pre) => ({ ...pre, [file.id]: { progress, file: file.instance } }));
            },
        }, baseId);
        setUploadingFiles((pre) => ({ ...pre, ...newUploadMap }));
        setTimeout(() => {
            scrollBottom();
        }, 100);
    }, [attachmentManager, baseId, handleSuccess, t, uploadingFiles]);
    const scrollBottom = () => {
        if (listRef.current) {
            const scrollHeight = listRef.current.scrollHeight;
            const height = listRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            listRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }
    };
    const len = useMemo(() => {
        return attachments.length + Object.keys(uploadingFiles).length;
    }, [attachments, uploadingFiles]);
    const fileCover = useCallback(({ mimetype, presignedUrl, lgThumbnailUrl }) => {
        if (!presignedUrl)
            return '';
        return lgThumbnailUrl ?? getFileCover(mimetype, presignedUrl);
    }, []);
    const uploadingFilesList = map(uploadingFiles, (value, key) => ({ id: key, ...value }));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setSortData((sortData) => {
                const oldIndex = sortData.findIndex((item) => item.id === active.id);
                const newIndex = sortData.findIndex((item) => item.id === over.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    onChange?.(arrayMove(sortData, oldIndex, newIndex));
                    return arrayMove(sortData, oldIndex, newIndex);
                }
                return sortData;
            });
        }
    };
    useEffect(() => {
        if (attachments && attachments.length) {
            setSortData([...attachments]);
        }
    }, [attachments]);
    return (_jsxs("div", { className: cn('flex h-full flex-col overflow-hidden', className), children: [_jsx("div", { className: "relative flex-1 overflow-y-auto", ref: listRef, children: _jsx(FileZone, { action: ['drop', 'paste'], defaultText: readonly ? t('common.empty') : t('editor.attachment.uploadDragDefault'), onChange: uploadAttachment, disabled: readonly, children: len > 0 && (_jsxs("ul", { className: "-right-2 flex size-full flex-wrap overflow-hidden", children: [_jsx(FilePreviewProvider, { i18nMap: i18nMap, children: _jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: sortData, disabled: readonly, strategy: rectSortingStrategy, children: sortData.map((attachment) => (_jsx(AttachmentItem, { attachment: attachment, onDelete: onDelete, downloadFile: downloadFile, fileCover: fileCover, readonly: readonly }, attachment.id))) }) }) }), uploadingFilesList.map(({ id, progress, file }) => (_jsxs("li", { className: "mb-2 flex h-32 w-28 flex-col pr-3", children: [_jsxs("div", { className: "relative flex w-full flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-border px-2", children: [_jsx(Progress, { value: progress }), progress, "%"] }), _jsx("span", { className: "w-full truncate text-center", title: file.name, children: file.name })] }, id)))] })) }) }), !readonly && _jsx(FileInput, { onChange: uploadAttachment })] }));
};
