export const splitRange = (start, end, parts) => {
    const arr = [];
    const step = (end - start) / parts;
    for (let i = 1; i < parts; i++) {
        arr.push(start + step * i);
    }
    return arr;
};
export const reorder = (dragElemSize, dropIndex, totalSize, getOrder) => {
    let newOrders = Array.from({ length: dragElemSize }).fill(0);
    if (dropIndex === 0) {
        newOrders = newOrders.map((_, index) => getOrder(0) - index - 1);
    }
    else if (dropIndex > totalSize - 1) {
        newOrders = newOrders.map((_, index) => getOrder(totalSize - 1) + index + 1);
    }
    else {
        const prevOrder = getOrder(dropIndex - 1);
        const nextOrder = getOrder(dropIndex);
        newOrders = splitRange(prevOrder, nextOrder, dragElemSize + 1);
    }
    return newOrders;
};
export const swapReorder = (dragElemSize, fromIndex, dropIndex, totalSize, getOrder) => {
    let newOrders = Array.from({ length: dragElemSize }).fill(0);
    if (dropIndex === 0) {
        newOrders = newOrders.map((_, index) => getOrder(0) - index - 1);
    }
    else if (dropIndex === totalSize - 1) {
        newOrders = newOrders.map((_, index) => getOrder(totalSize - 1) + index + 1);
    }
    else {
        /**
         * different between above reorder
         * this way is to swap order
         */
        const index = dropIndex > fromIndex ? dropIndex + 1 : dropIndex;
        const prevOrder = getOrder(index - 1);
        const nextOrder = getOrder(index);
        newOrders = splitRange(prevOrder, nextOrder, dragElemSize + 1);
    }
    return newOrders;
};
export const insertSingle = (insertAt, totalSize, getOrder, isInsertAfter = true) => {
    let newOrder;
    if (insertAt === 0 && !isInsertAfter) {
        newOrder = getOrder(0) - 1;
    }
    else if (insertAt >= totalSize - 1 && isInsertAfter) {
        newOrder = getOrder(totalSize - 1) + 1;
    }
    else {
        const prevIndex = isInsertAfter ? insertAt : insertAt - 1;
        const nextIndex = isInsertAfter ? insertAt + 1 : insertAt;
        const prevOrder = getOrder(prevIndex);
        const nextOrder = getOrder(nextIndex);
        newOrder = (prevOrder + nextOrder) / 2;
    }
    return newOrder;
};
