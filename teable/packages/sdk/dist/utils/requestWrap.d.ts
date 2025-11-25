type IRequestFunction<T extends unknown[], R> = (...args: T) => R;
export declare function requestWrap<T extends unknown[], R>(fn: IRequestFunction<T, Promise<R>>): IRequestFunction<T, Promise<R>>;
export {};
