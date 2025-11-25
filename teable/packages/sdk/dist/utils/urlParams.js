export function addQueryParamsToWebSocketUrl(url, params) {
    const urlObj = new URL(url);
    Object.keys(params).forEach((key) => {
        urlObj.searchParams.set(key, params[key]);
    });
    return urlObj.toString();
}
