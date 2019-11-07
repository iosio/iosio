import {h, Component, render} from "preact"

import {obi} from "@iosio/obi";
import {Router, routing, lazyLoader} from "../src";

import {useObi} from '@iosio/obi-preact-connect';


const access = obi({
    loggedIn: false
});

class Blog extends Component{
    render() {
        console.log('blog rendered');
        return <h1>blog</h1>
    }
}

const publicAccess = {
    '/': () => <h1>home</h1>,
    '/about': () => <h1>about</h1>,
    '/blog': Blog,
    '/lazy1': lazyLoader(()=>import('./pages/lazy1')),
    '/lazy2': lazyLoader(()=>import('./pages/lazy2')),
};

const fullAccess = {
    ...publicAccess,
    '/admin': () => <h1>Admin</h1>,
    '/admin/articles': () => <h1>articles</h1>,
    '/admin/account': () => <h1>account</h1>
};





const App = ()=>{

    useObi(access);

    const pathMap = access.loggedIn ? fullAccess : publicAccess;

    return(
        <div>
            {Object.keys(pathMap).map(path => (
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
                '/': ()=> <Router pathMap={publicAccess}/>,
                '/admin': ()=> <Router pathMap={fullAccess}/>
            }}/>

        </div>
    )
}


render(<App/>, document.body);



