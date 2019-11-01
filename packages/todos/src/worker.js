import greenlet from "greenlet";

export const searchWorker = greenlet(({list, value}) => new Promise(resolve => {
    resolve({
        update: list.filter(t => t.name.toLowerCase().search(value) !== -1),
        originalSearch: value
    })
}));
