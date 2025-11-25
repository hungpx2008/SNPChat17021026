"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicFullStorageUrl = exports.READ_PATH = exports.pathJoin = void 0;
const pathJoin = (...parts) => {
    const separator = '/';
    const replace = new RegExp(separator + '+', 'g');
    return parts.join(separator).replace(replace, separator);
};
exports.pathJoin = pathJoin;
exports.READ_PATH = '/api/attachments/read';
const getPublicFullStorageUrl = (storage, path) => {
    const { prefix, provider, publicUrl, publicBucket } = storage;
    const bucket = publicBucket || '';
    if (publicUrl) {
        return publicUrl + (0, exports.pathJoin)('/', path);
    }
    if (provider === 'minio') {
        return prefix + (0, exports.pathJoin)('/', bucket, path);
    }
    if (provider === 's3' || provider === 'aliyun') {
        return prefix + (0, exports.pathJoin)('/', path);
    }
    return prefix + (0, exports.pathJoin)(exports.READ_PATH, bucket, path);
};
exports.getPublicFullStorageUrl = getPublicFullStorageUrl;
