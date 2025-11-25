export declare function useUploadFile(): {
    isUploading: boolean;
    progress: number;
    uploadedFile: {
        key: string;
        url: string;
        name: string;
        size: number;
        type: string;
        path: string;
    } | null;
    uploadFile: (file: File) => Promise<{
        key: string;
        url: string;
        name: string;
        size: number;
        type: string;
        path: string;
    }>;
    uploadingFile: File | null;
};
