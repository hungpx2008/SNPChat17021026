import { inRange, debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useRecords } from './use-records';
// eslint-disable-next-line
export const LOAD_PAGE_SIZE = 300;
const defaultVisiblePages = { y: 0, height: 0 };
export const useInfiniteRecords = (recordsQuery, initRecords) => {
    const [query, setQuery] = useState({
        skip: 0,
        take: LOAD_PAGE_SIZE,
        ...recordsQuery,
    });
    const queryRef = useRef(query);
    queryRef.current = query;
    const { records } = useRecords(query, initRecords);
    const [loadedRecordMap, setLoadedRecordMap] = useState(() => records.reduce((acc, record, i) => {
        acc[i] = record;
        return acc;
    }, {}));
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
    }, [records]);
    useEffect(() => onForceUpdate(), [onForceUpdate]);
    useEffect(() => {
        const { y, height } = visiblePages;
        setQuery((cv) => {
            if (cv.skip === undefined) {
                return cv;
            }
            const take = cv.take ?? LOAD_PAGE_SIZE;
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
                    ...recordsQuery,
                    skip: Math.max(0, skip),
                };
            }
            return {
                take: cv.take,
                ...recordsQuery,
                skip: cv.skip,
            };
        });
    }, [visiblePages, recordsQuery]);
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
        setVisiblePages(defaultVisiblePages);
    }, []);
    return {
        recordMap: loadedRecordMap,
        onVisibleRegionChanged,
        onForceUpdate,
        onReset,
    };
};
