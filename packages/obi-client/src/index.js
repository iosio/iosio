import {obi} from "@iosio/obi";


export const obiClient = ({ routes, ...rest}) => {
    const $client = obi({

        fetchingStates: Object.keys(routes).reduce((obj, name) => (obj[name] = false, obj), {}),

        ...Object.keys(routes).reduce((obj, name) => {
            obj[name] = (...args) => {
                $client.fetchingStates[name] = true;
                return routes[name](...args).then(data => {
                    $client.fetchingStates[name] = false;
                    return data;
                }).catch(err => {
                    $client.fetchingStates[name] = false;
                    return Promise.reject(err);
                })
            };
            return obj;
        }, {}),

        ...rest
    });

    return $client;
};