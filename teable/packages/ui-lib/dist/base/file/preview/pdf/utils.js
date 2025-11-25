import { getBlobFromUrl } from '../office/utils';
export const getBlobUrlFromUrl = async (url) => {
    const blob = await getBlobFromUrl(url);
    return URL.createObjectURL(blob);
};
