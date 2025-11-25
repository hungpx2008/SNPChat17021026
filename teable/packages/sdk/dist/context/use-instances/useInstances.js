//
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useConnection } from '../../hooks/use-connection';
import { OpListenersManager } from './opListener';
import { instanceReducer } from './reducer';
const queryDestroy = (query, cb) => {
    if (!query) {
        return;
    }
    if (!query.sent || query.ready) {
        query?.destroy(() => {
            query.removeAllListeners();
            cb?.();
            query.results?.forEach((doc) => doc.listenerCount('op batch') === 0 && doc.destroy());
        });
        return;
    }
    query.once('ready', () => {
        query.destroy(() => {
            query.removeAllListeners();
            cb?.();
            query.results?.forEach((doc) => doc.listenerCount('op batch') === 0 && doc.destroy());
        });
    });
};
const subscribeQueryCache = new Map();
// Normalize query params into a stable, comparable string key
// - Sort object keys recursively
// - Convert Set to sorted array
// - Leave arrays and primitives as-is (arrays keep order)
// This is intentionally minimal for typical query param shapes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeForKey = (value) => {
    if (value == null)
        return value;
    if (Array.isArray(value))
        return value.map(normalizeForKey);
    if (value instanceof Set)
        return Array.from(value).sort();
    if (value instanceof Map)
        return Array.from(value.entries())
            .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
            .map(([k, v]) => [k, normalizeForKey(v)]);
    if (typeof value === 'object' && value.constructor === Object) {
        const sortedKeys = Object.keys(value).sort();
        const res = {};
        for (const k of sortedKeys)
            res[k] = normalizeForKey(value[k]);
        return res;
    }
    return value;
};
const makeQueryKey = (collection, queryParams) => `${collection}|${JSON.stringify(normalizeForKey(queryParams))}`;
const acquireQuery = (collection, connection, queryParams) => {
    const key = makeQueryKey(collection, queryParams);
    const cached = subscribeQueryCache.get(key);
    if (cached) {
        cached.refCount += 1;
        return { key, query: cached.query };
    }
    const query = connection.createSubscribeQuery(collection, queryParams);
    subscribeQueryCache.set(key, { query, refCount: 1 });
    return { key, query };
};
const releaseQuery = (key, cb) => {
    if (!key)
        return;
    const cached = subscribeQueryCache.get(key);
    if (!cached)
        return;
    cached.refCount -= 1;
    if (cached.refCount <= 0) {
        subscribeQueryCache.delete(key);
        queryDestroy(cached.query, cb);
        return;
    }
    cb?.();
};
/**
 * Manage instances of a collection, auto subscribe the update and change event, auto create instance,
 * keep every instance the latest data
 * @returns instance[]
 */
export function useInstances({ collection, factory, queryParams, initData, }) {
    const { connection, connected } = useConnection();
    const [query, setQuery] = useState();
    const currentKeyRef = useRef();
    const [instances, dispatch] = useReducer((state, action) => instanceReducer(state, action, factory), {
        instances: initData && !connected ? initData.map((data) => factory(data)) : [],
        extra: undefined,
    });
    const opListeners = useRef(new OpListenersManager(collection));
    const preQueryRef = useRef();
    const lastConnectionRef = useRef();
    const handleReady = useCallback((query) => {
        console.log(`${query.collection}:ready:`, query.query, localStorage.getItem('debug') && query.results.map((doc) => doc.data));
        console.log('extra ready ->', query.extra);
        if (!query.results) {
            return;
        }
        dispatch({ type: 'ready', results: query.results, extra: query.extra });
        query.results.forEach((doc) => {
            opListeners.current.add(doc, (op) => {
                console.log(`${query.collection} on op:`, op, doc);
                dispatch({ type: 'update', doc });
            });
        });
    }, []);
    const handleInsert = useCallback((docs, index) => {
        console.log(`${docs[0]?.collection}:insert:`, docs.map((doc) => doc.id), index);
        dispatch({ type: 'insert', docs, index });
        docs.forEach((doc) => {
            opListeners.current.add(doc, (op) => {
                console.log(`${docs[0]?.collection} on op:`, op);
                dispatch({ type: 'update', doc });
            });
        });
    }, []);
    const handleRemove = useCallback((docs, index) => {
        console.log(`${docs[0]?.collection}:remove:`, docs.map((doc) => doc.id), index);
        dispatch({ type: 'remove', docs, index });
        docs.forEach((doc) => {
            opListeners.current.remove(doc);
        });
    }, []);
    const handleMove = useCallback((docs, from, to) => {
        console.log(`${docs[0]?.collection}:move:`, docs.map((doc) => doc.id), from, to);
        dispatch({ type: 'move', docs, from, to });
    }, []);
    const handleExtra = useCallback((extra) => {
        console.log('extra', extra);
        dispatch({ type: 'extra', extra });
    }, []);
    useEffect(() => {
        if (!collection || !connection) {
            setQuery(undefined);
            return;
        }
        // Compute normalized key and short-circuit if unchanged and connection didn't change
        const nextKey = makeQueryKey(collection, queryParams);
        const connectionChanged = lastConnectionRef.current !== connection;
        if (!connectionChanged && currentKeyRef.current === nextKey && preQueryRef.current) {
            // Ensure state holds the existing query instance without re-acquiring
            setQuery((prev) => prev ?? preQueryRef.current);
            return;
        }
        const { key, query } = acquireQuery(collection, connection, queryParams);
        currentKeyRef.current = key;
        preQueryRef.current = query;
        lastConnectionRef.current = connection;
        setQuery(query);
    }, [connection, collection, queryParams]);
    useEffect(() => {
        const listeners = opListeners.current;
        const keyAtMount = currentKeyRef.current;
        const hasQuery = Boolean(query);
        return () => {
            // forbid clear query when query is not set but currentKeyRef.current is set
            if (!hasQuery) {
                return;
            }
            // for easy component refresh clean data when switch & loading
            dispatch({ type: 'clear' });
            // release cached query on unmount or when switching queries
            releaseQuery(keyAtMount, () => listeners.clear());
        };
    }, [query]);
    useEffect(() => {
        if (!query) {
            return;
        }
        const readyListener = () => handleReady(query);
        const changedListener = (docs) => {
            console.log(`${docs[0]?.collection}:changed:`, docs.map((doc) => doc.id));
        };
        if (query.ready) {
            readyListener();
        }
        query.on('ready', readyListener);
        query.on('changed', changedListener);
        query.on('insert', handleInsert);
        query.on('remove', handleRemove);
        query.on('move', handleMove);
        query.on('extra', handleExtra);
        return () => {
            query.removeListener('ready', readyListener);
            query.removeListener('changed', changedListener);
            query.removeListener('insert', handleInsert);
            query.removeListener('remove', handleRemove);
            query.removeListener('move', handleMove);
            query.removeListener('extra', handleExtra);
        };
    }, [query, handleInsert, handleRemove, handleMove, handleReady, handleExtra]);
    return instances;
}
