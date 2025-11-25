import { throttle } from 'lodash';
const imgPool = [];
const rowShift = 1 << 16;
function packColRowToNumber(col, row) {
    return row * rowShift + col;
}
function unpackCol(packed) {
    return packed % rowShift;
}
function unpackRow(packed, col) {
    return (packed - col) / rowShift;
}
function unpackNumberToColRow(packed) {
    const col = unpackCol(packed);
    const row = unpackRow(packed, col);
    return [col, row];
}
export class ImageManager {
    imageLoaded = () => undefined;
    loadedLocations = [];
    visibleWindow = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    freezeColumnCount = 0;
    isInWindow = (packed) => {
        const col = unpackCol(packed);
        const row = unpackRow(packed, col);
        const w = this.visibleWindow;
        if (col < this.freezeColumnCount && row >= w.y && row <= w.y + w.height)
            return true;
        return col >= w.x && col <= w.x + w.width && row >= w.y && row <= w.y + w.height;
    };
    cache = {};
    setCallback(imageLoaded) {
        this.imageLoaded = imageLoaded;
    }
    sendLoaded = throttle(() => {
        this.imageLoaded(this.loadedLocations);
        this.loadedLocations = [];
    }, 20);
    clearOutOfWindow = () => {
        const keys = Object.keys(this.cache);
        for (const key of keys) {
            const obj = this.cache[key];
            let keep = false;
            for (let j = 0; j < obj.cells.length; j++) {
                const packed = obj.cells[j];
                if (this.isInWindow(packed)) {
                    keep = true;
                    break;
                }
            }
            if (keep) {
                obj.cells = obj.cells.filter(this.isInWindow);
            }
            else {
                obj.cancel();
                delete this.cache[key];
            }
        }
    };
    setWindow(newWindow, freezeColumnCount) {
        if (this.visibleWindow.x === newWindow.x &&
            this.visibleWindow.y === newWindow.y &&
            this.visibleWindow.width === newWindow.width &&
            this.visibleWindow.height === newWindow.height &&
            this.freezeColumnCount === freezeColumnCount)
            return;
        this.visibleWindow = newWindow;
        this.freezeColumnCount = freezeColumnCount;
        this.clearOutOfWindow();
    }
    loadImage(url, col, row, key) {
        let loaded = false;
        const img = imgPool.pop() ?? new Image();
        let canceled = false;
        const result = {
            img: undefined,
            cells: [packColRowToNumber(col, row)],
            url,
            cancel: () => {
                if (canceled)
                    return;
                canceled = true;
                if (imgPool.length < 12) {
                    imgPool.unshift(img); // never retain more than 12
                }
                else if (!loaded) {
                    img.src = '';
                }
            },
        };
        const loadPromise = new Promise((r) => img.addEventListener('load', () => r(null)));
        // use request animation time to avoid paying src set costs during draw calls
        requestAnimationFrame(async () => {
            try {
                img.src = url;
                await loadPromise;
                await img.decode();
                const toWrite = this.cache[key];
                if (toWrite !== undefined && !canceled) {
                    toWrite.img = img;
                    for (const packed of toWrite.cells) {
                        this.loadedLocations.push(unpackNumberToColRow(packed));
                    }
                    loaded = true;
                    this.sendLoaded();
                }
            }
            catch {
                result.cancel();
            }
        });
        this.cache[key] = result;
    }
    loadOrGetImage(url, col, row) {
        const key = url;
        const current = this.cache[key];
        if (current !== undefined) {
            const packed = packColRowToNumber(col, row);
            if (!current.cells.includes(packed)) {
                current.cells.push(packed);
            }
            return current.img;
        }
        else {
            this.loadImage(url, col, row, key);
        }
        return undefined;
    }
}
