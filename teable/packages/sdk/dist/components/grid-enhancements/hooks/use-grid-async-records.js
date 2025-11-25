import { inRange, debounce, get, pick, groupBy } from 'lodash';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useFields, useSearch, useTableId } from '../../../hooks';
import { useRecords } from '../../../hooks/use-records';
import { useBuildBaseAgentStore } from '../store/useBuildBaseAgentStore';
// eslint-disable-next-line
export const LOAD_PAGE_SIZE = 300;
const defaultVisiblePages = { x: 0, y: 0, width: 0, height: 0 };
const getRecordSearchHitIndex = (extra) => {
    const searchHitIndex = get(extra, 'searchHitIndex');
    if (!searchHitIndex || !searchHitIndex.length) {
        return [];
    }
    const groupedIndexes = [];
    searchHitIndex.forEach((item) => {
        const index = groupedIndexes.findIndex((group) => group.recordId === item.recordId);
        if (index > -1) {
            groupedIndexes[index] = {
                recordId: item.recordId,
                fieldId: [...groupedIndexes[index].fieldId, item.fieldId],
            };
        }
        else {
            groupedIndexes.push({
                recordId: item.recordId,
                fieldId: [item.fieldId],
            });
        }
    });
    return groupedIndexes;
};
const getRecordSearchHitIndexMap = (extra) => {
    const groupedSearchHitIndex = getRecordSearchHitIndex(extra);
    return groupedSearchHitIndex.reduce((acc, item, index) => {
        acc[index] = item;
        return acc;
    }, {});
};
const getSearchHitIndexFromRecordMap = (groupedSearchHitIndexMap) => {
    if (!groupedSearchHitIndexMap || Object.values(groupedSearchHitIndexMap).length === 0) {
        return undefined;
    }
    return Object.values(groupedSearchHitIndexMap)
        .filter((item) => !!item)
        .flatMap((item) => item.fieldId.map((fieldId) => ({ fieldId, recordId: item.recordId })));
};
export const useGridAsyncRecords = (initRecords, initQuery, outerQuery, initGroupPoints) => {
    const [query, setQuery] = useState({
        skip: 0,
        take: LOAD_PAGE_SIZE,
        ...initQuery,
    });
    const tableId = useTableId();
    const recordsQuery = useMemo(() => ({ ...query, ...outerQuery }), [query, outerQuery]);
    const queryRef = useRef(query);
    const { building, displayRecord, tableId: actionTableId } = useBuildBaseAgentStore();
    queryRef.current = query;
    const { searchQuery } = useSearch();
    const [searchValue, searchFields] = searchQuery || [];
    const { records, extra } = useRecords(recordsQuery, initRecords);
    const [loadedRecordMap, setLoadedRecordMap] = useState(() => records.reduce((acc, record, i) => {
        acc[i] = record;
        return acc;
    }, {}));
    const defaultRecordMap = useMemo(() => {
        const res = {};
        Object.entries(loadedRecordMap).forEach(([key, record]) => {
            if (!record) {
                res[key] = undefined;
            }
            else {
                const recordCopy = Object.create(Object.getPrototypeOf(record));
                Object.assign(recordCopy, { ...record, fields: {} });
                res[key] = recordCopy;
            }
        });
        return res;
    }, [loadedRecordMap]);
    const fields = useFields();
    const computedFieldIds = useMemo(() => {
        return fields.filter((field) => field.isComputed).map((field) => field.id);
    }, [fields]);
    const [loadedRecordSearchHitMap, setLoadedRecordSearchHitMap] = useState(() => {
        return getRecordSearchHitIndexMap(extra);
    });
    const loadedSearchHitIndex = useMemo(() => {
        return getSearchHitIndexFromRecordMap(loadedRecordSearchHitMap);
    }, [loadedRecordSearchHitMap]);
    const [groupPoints, setGroupPoints] = useState(() => (extra == null
        ? initGroupPoints
        : extra?.groupPoints) ?? null);
    const [visiblePages, setVisiblePages] = useState(defaultVisiblePages);
    const visiblePagesRef = useRef(visiblePages);
    visiblePagesRef.current = visiblePages;
    const onForceUpdate = useCallback(() => {
        const startIndex = queryRef.current.skip ?? 0;
        const take = queryRef.current.take ?? LOAD_PAGE_SIZE;
        setLoadedRecordMap((preLoadedRecords) => {
            const cacheLen = take * 2;
            const [cacheStartIndex, cacheEndIndex] = [
                Math.max(startIndex - cacheLen / 2, 0),
                startIndex + records.length + cacheLen / 2,
            ];
            const newRecordsState = {};
            for (let i = cacheStartIndex; i < cacheEndIndex; i++) {
                if (startIndex <= i && i < startIndex + records.length) {
                    newRecordsState[i] = records[i - startIndex];
                    continue;
                }
                newRecordsState[i] = preLoadedRecords[i];
            }
            return newRecordsState;
        });
        if (get(extra, 'searchHitIndex')) {
            setLoadedRecordSearchHitMap((preLoadedRecords) => {
                if (!preLoadedRecords || Object.values(preLoadedRecords).length === 0) {
                    return getRecordSearchHitIndexMap(extra);
                }
                const indexes = getRecordSearchHitIndex(extra);
                const cacheLen = take * 2;
                const [cacheStartIndex, cacheEndIndex] = [
                    Math.max(startIndex - cacheLen / 2, 0),
                    startIndex + indexes.length + cacheLen / 2,
                ];
                const newRecordsState = {};
                for (let i = cacheStartIndex; i < cacheEndIndex; i++) {
                    if (startIndex <= i && i < startIndex + indexes.length) {
                        newRecordsState[i] = indexes[i - startIndex];
                        continue;
                    }
                    newRecordsState[i] = preLoadedRecords[i];
                }
                return newRecordsState;
            });
        }
        if (extra != null) {
            setGroupPoints(extra?.groupPoints ?? null);
        }
    }, [records, extra]);
    useEffect(() => onForceUpdate(), [onForceUpdate]);
    useEffect(() => {
        const { y, height } = visiblePages;
        setQuery((cv) => {
            if (cv.skip === undefined) {
                return cv;
            }
            const take = initQuery?.take ?? cv.take ?? LOAD_PAGE_SIZE;
            const pageOffsetSize = take / 3;
            const pageGap = take / 3;
            const visibleStartIndex = cv.skip <= y ? cv.skip - pageOffsetSize : cv.skip + pageOffsetSize;
            const visibleEndIndex = visibleStartIndex + take;
            const viewInRange = inRange(y, visibleStartIndex, visibleEndIndex) &&
                inRange(y + height, visibleStartIndex, visibleEndIndex);
            if (!viewInRange) {
                const skip = Math.floor(y / pageGap) * pageGap - pageGap;
                return {
                    take: cv.take,
                    ...initQuery,
                    skip: Math.max(0, skip),
                };
            }
            return {
                take: cv.take,
                ...initQuery,
                skip: cv.skip,
            };
        });
    }, [visiblePages, initQuery]);
    const updateVisiblePages = useMemo(() => {
        return debounce(setVisiblePages, 30, { maxWait: 500 });
    }, []);
    const onVisibleRegionChanged = useCallback((r) => {
        const { y, height } = visiblePagesRef.current;
        if (r.y === y && r.height === height)
            return;
        updateVisiblePages(r);
    }, [updateVisiblePages]);
    const onReset = useCallback(() => {
        setLoadedRecordMap({});
        setLoadedRecordSearchHitMap(undefined);
        setVisiblePages(defaultVisiblePages);
    }, []);
    useEffect(() => {
        setLoadedRecordSearchHitMap(undefined);
    }, [searchFields, searchValue]);
    const finalRecordMap = useMemo(() => {
        if (!building || tableId !== actionTableId) {
            return loadedRecordMap;
        }
        if (displayRecord?.length && tableId === actionTableId) {
            const res = {};
            const group = groupBy(displayRecord, 0);
            Object.entries(loadedRecordMap).forEach(([key, record]) => {
                const originRecordFieldIds = group[key]?.map((item) => item?.[1]);
                const recordFieldIds = originRecordFieldIds?.length
                    ? originRecordFieldIds.concat(computedFieldIds || [])
                    : computedFieldIds || [];
                if (!record || !recordFieldIds.length) {
                    res[key] = undefined;
                }
                else {
                    const recordCopy = Object.create(Object.getPrototypeOf(record));
                    Object.assign(recordCopy, record);
                    const newFields = pick(record?.fields, recordFieldIds) || undefined;
                    recordCopy.fields = newFields;
                    res[key] = recordCopy;
                }
            });
            return res;
        }
        return defaultRecordMap;
    }, [
        actionTableId,
        building,
        computedFieldIds,
        defaultRecordMap,
        displayRecord,
        loadedRecordMap,
        tableId,
    ]);
    return {
        groupPoints,
        allGroupHeaderRefs: extra?.allGroupHeaderRefs ?? null,
        recordMap: finalRecordMap,
        onVisibleRegionChanged,
        recordsQuery,
        onForceUpdate,
        onReset,
        searchHitIndex: loadedSearchHitIndex,
    };
};
