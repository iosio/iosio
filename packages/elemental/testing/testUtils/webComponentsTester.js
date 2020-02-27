import {series} from "asyncro";

const until = (time = 0) => new Promise(r => setTimeout(r, time));

export const webComponentTester = async ({tag, Class, asyncMount = 'mounted', tests}) => {
    tag && Class && customElements.define(tag, Class);
    let component = document.createElement(tag);
    document.body.appendChild(component);

    if (asyncMount) {
        await component[asyncMount]
    }

    if (Array.isArray(tests)) {
        await series(tests.map(t => (async () => await t({component, until}))))
    }
};
