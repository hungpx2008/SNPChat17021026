import type { INotifyVo, UploadType } from '@teable/openapi';
interface IUploadTask {
    file: IFile;
    status: Status;
    progress: number;
    type: UploadType;
    baseId?: string;
    successCallback: ISuccessCallback;
    errorCallback: IErrorCallback;
    progressCallback: IProgressCallback;
}
export interface IFile {
    id: string;
    instance: File;
}
type ISuccessCallback = (file: IFile, attachment: INotifyVo) => void;
type IErrorCallback = (file: IFile, error?: string, code?: number) => void;
type IProgressCallback = (file: IFile, progress: number) => void;
export declare enum Status {
    Pending = 0,
    Uploading = 1,
    Completed = 2
}
export declare class AttachmentManager {
    limit: number;
    uploadQueue: IUploadTask[];
    shareId?: string;
    constructor(limit: number);
    upload(files: IFile[], type: UploadType, callbackFn: {
        successCallback?: ISuccessCallback;
        errorCallback?: IErrorCallback;
        progressCallback?: IProgressCallback;
    }, baseId?: string): void;
    executeUpload(uploadTask: IUploadTask): Promise<void>;
    completeUpload(uploadTask: IUploadTask, attachment: INotifyVo): void;
}
export {};
