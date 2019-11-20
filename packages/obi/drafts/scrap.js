
/*

import {obi} from "@iosio/obi";

export const state = obi({
    loggedIn: false,
    some:{
        nested:{
            value: 'derp'
        }
    },
    user: {
        firstName: 'bob',
        lastName: 'smith',
        type: 'admin',
        address:{
            street:'',
            city: '',
            state: '',
            zip: ''
        }
    }
});

state.user.$onChange((state, paths) => {
    console.log(paths);
});

let count = 0;
setInterval(() => {
    state.user.$merge(() => {
        state.user.firstName = '!@#$@!#' + ' ' + count++;
        state.user.lastName = '@#$@!#$!@#$!@#$' + ' ' + count++;
    });
}, 1000);


    useObi([select(state, ['loggedIn']), state.user, state.some.nested]);


*/