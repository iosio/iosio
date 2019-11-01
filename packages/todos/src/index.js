import {lorem} from "@iosio/lorem";
import {debounce} from "@iosio/util";
import {obi} from "@iosio/obi";

const todoStubs = [
    'Make sweet library', 'make cool apps',
    'test library', 'go buy dog food', 'register vehicles'
];

let count = 0;
const defaultTodos = todoStubs.map((name) => ({id: count++, name, completed: false}));
Promise.pending = Promise.race.bind(Promise, []);

let cancel = () => {
};

import('./worker');
let searching = false;
const workerSearch = (value_, list_) => {
    searching = true;
    //hack for safari -- system js doesn't like it
    return import('./worker').then(({searchWorker}) =>
        new Promise(resolveIt => {
            cancel = () => resolveIt(Promise.pending());
            searchWorker({value: value_, list: list_}).then(resolveIt);
        }))
};


let resultsCache = {};
const clearCache = () => resultsCache = {};

let clearAfterCreate = ()=>{};

const setSearchValue = value => {
    if (searching) {
        cancel();
        searching = false;
    }
    todos.searchValue = value;
    value = value.toLowerCase();

    if (value.length === 0) {
        todos.displayList = [...todos.list];
    } else if (resultsCache[value]) {
        todos.displayList = resultsCache[value];
    } else {
        workerSearch(value, todos.list)
            .then(({update, originalSearch}) => {
                resultsCache[originalSearch] = update;
                if (value === originalSearch && value.length !== 0) {
                    todos.displayList = update;
                } else if (value.length === 0) {
                    todos.displayList = [...todos.list];
                }
            });

    }
};
const debouncedSearch = debounce(setSearchValue, 2);


export const todos = obi({
    list: defaultTodos,
    displayList: defaultTodos,
    todoName: '',
    searchValue: '',
    testValue: true,
    makeABunch() {
        clearAfterCreate();
        todos.displayList = todos.list = [
            ...todos.list,
            ...lorem().split(' ').map((name) => ({id: count++, name: name + ` ${count}`, completed: false}))
        ];
    },
    removeTodo(todo) {
        let updated = todos.list.filter(mt => mt.id !== todo.id),
            filtered = todos.searchValue.length === 0
                ? updated
                : updated.filter(t => t.name.search(todos.searchValue) !== -1);
        todos.list = [...updated];
        todos.displayList = [...filtered]
    },
    setSearchValueDebounced: debouncedSearch,
    setSearchValue,
    addTodo(e) {
        e && e.preventDefault();
        todos.list.push({
            name: todos.todoName,
            id: count++,
            completed: false
        });
        clearCache();
        todos.displayList = todos.list = [...todos.list];
        todos.searchValue = todos.todoName = '';
    },
    captureEnter(e) {
        if (((e.keyCode || e.which) === 13)) todos.addTodo(e);
    }
});

