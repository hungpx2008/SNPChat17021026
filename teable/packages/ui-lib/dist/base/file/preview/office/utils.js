export const getBlobFromUrl = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.blob();
    }
    catch (error) {
        console.error('Error fetching file', error);
        throw error;
    }
};
export const numberCoordinate2Letter = (n) => {
    let result = '';
    while (n > 0) {
        n -= 1;
        result = String.fromCharCode((n % 26) + 'A'.charCodeAt(0)) + result;
        n = Math.floor(n / 26);
    }
    return result;
};
export const letterCoordinate2Number = (letters) => {
    let result = 0;
    for (let i = 0; i < letters.length; i++) {
        const charValue = letters.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
        result = result * 26 + charValue;
    }
    return result;
};
export const getEndColumn = (range) => {
    const match = range.match(/:(\D+)\d+$/);
    return match ? match[1] : `${range}:${range}`;
};
