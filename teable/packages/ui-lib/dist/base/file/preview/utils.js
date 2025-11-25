export const isImage = (mimetype) => {
    return mimetype.startsWith('image/');
};
export const isVideo = (mimetype) => {
    return mimetype.startsWith('video/');
};
export const isAudio = (mimetype) => {
    return mimetype.startsWith('audio/');
};
export const isText = (mimetype) => {
    return mimetype.startsWith('text/');
};
export const isPdf = (mimetype) => {
    return mimetype.startsWith('application/pdf') || mimetype.startsWith('application/x-pdf');
};
export const isWord = (mimetype) => {
    return (mimetype.startsWith('application/msword') ||
        mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
};
export const isExcel = (mimetype) => {
    return (mimetype.startsWith('application/vnd.ms-excel') ||
        mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
        mimetype.startsWith('text/csv') ||
        mimetype.startsWith('application/csv'));
};
export const isPpt = (mimetype) => {
    return (mimetype.startsWith('application/vnd.ms-powerpoint') ||
        mimetype.startsWith('application/vnd.openxmlformats-officedocument.presentationml.presentation'));
};
export const isMarkdown = (mimetype) => {
    return mimetype.startsWith('text/markdown');
};
export const isPackage = (mimetype) => {
    return mimetype.startsWith('application/zip');
};
