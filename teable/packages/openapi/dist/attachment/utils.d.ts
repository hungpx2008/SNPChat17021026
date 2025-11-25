export declare const pathJoin: (...parts: string[]) => string;
export declare const READ_PATH = "/api/attachments/read";
export declare const getPublicFullStorageUrl: (storage: {
    provider?: 'local' | 's3' | 'minio' | 'aliyun';
    prefix?: string;
    publicBucket?: string;
    publicUrl?: string;
}, path: string) => string;
