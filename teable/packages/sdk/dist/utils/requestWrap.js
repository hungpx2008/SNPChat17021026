import { errorRequestHandler } from '../context';
export function requestWrap(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args)
                .then((res) => resolve(res))
                .catch((err) => {
                errorRequestHandler(err);
                reject(err);
            });
        });
    };
}
