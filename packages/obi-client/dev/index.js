import {obiClient} from "../src";

const mockRequest = (delayTime) => new Promise(resolve => setTimeout(() => resolve(), delayTime || 0));


const routes = {
    route1: () => mockRequest(1000),
    route2: () => mockRequest(2000),
    route3: () => mockRequest(3000)
};

const client = obiClient(routes);


client.fetchingStates.$onChange((routes, paths) => {
    const fetching = paths[0].split('.')[1];

    console.log((routes[fetching] ? 'requesting: ' : 'resolved: ') + fetching);


});


Object.keys(routes).forEach(key => {
    client[key]()
});

