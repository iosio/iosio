import {h, Component, render} from "preact"

import {obi} from "@iosio/obi";
import {Router, routing, lazyLoader} from "../src";

import {useObi} from '@iosio/obi-preact-connect';


const access = obi({
    loggedIn: false
});

class Blog extends Component {
    render() {
        console.log('blog rendered');
        return (
            <div>
                <h1>blog</h1>
                <button onClick={()=>routing.route(false, {id: 1})}> blog 1</button>
                <button onClick={()=>routing.route(false, {id: 2})}> blog 2</button>
                <button onClick={()=>routing.route(false, {id: 3})}> blog 3</button>
            </div>
        )
    }
}

const publicAccess = {
    '/': () => <h1>home</h1>,
    '/about': () => <h1>about</h1>,
    '/blog': Blog,
    '/lazy1': lazyLoader(() => import('./pages/lazy1')),
    '/lazy2': lazyLoader(() => import('./pages/lazy2')),
};

const admin = {
    '/admin': () => <h1>Admin</h1>,
    '/admin/articles': () => <h1>articles</h1>,
    '/admin/account': () => <h1>account</h1>
};

const App = () => {

    useObi(access);

    return (
        <div>
            {Object.keys({...publicAccess, ...(access.loggedIn ? admin : {})}).map(path => (
                <button key={path} onClick={() => routing.route(path)}>
                    {path}
                </button>
            ))}

            <button onClick={() => routing.route('/derrrrrrpp')}>
                invalid route
            </button>

            <br/>

            <button onClick={() => access.loggedIn = !access.loggedIn}>
                toggle login
            </button>

            <Router root pathMap={{
                '/': () => <Router pathMap={publicAccess}/>,
                ...(access.loggedIn ? {'/admin': () => <Router pathMap={admin}/>} : {})
            }}/>

        </div>
    )
};


render(<App/>, document.body);



