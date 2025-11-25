export const QuerySortedKeys = [
    'select',
    'join',
    'where',
    'orderBy',
    'groupBy',
    'limit',
    'offset',
    'aggregation',
];
export const QuerySortedKeysMap = QuerySortedKeys.reduce((acc, key, index) => {
    acc[key] = index;
    return acc;
}, {});
