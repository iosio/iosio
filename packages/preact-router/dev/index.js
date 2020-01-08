import {h, Component, render} from "preact"

import {obi} from "@iosio/obi";
import {Router, routing, lazyLoader, anchorTagResetStyles, Linkage} from "../src";

import {useObi} from '@iosio/obi-preact-connect';

const access = obi({
    loggedIn: false
});
const linkStyle = (isActive) => ({
    color: isActive ? 'green' : 'inherit',
    margin: 10,
    display: 'block',
    fontWeight: 'bold'
});


const Link = ({toPath, toParams, name, ...rest}) => (
    <Linkage toPath={toPath} toParams={toParams} listenTo={'pathname'} {...rest}>
        {({isActive}) => (
            <span style={linkStyle(isActive)}>
                {name}
            </span>
        )}
    </Linkage>
);

const LinkParams = ({toPath, toParams, name, ...rest}) => (
    <Linkage toPath={toPath} toParams={toParams} listenTo={'search'} {...rest}>
        {({isActive}) => (
            <span style={linkStyle(isActive)}>
                {name}
            </span>
        )}
    </Linkage>
);


class Blog extends Component {
    render() {
        console.log('blog rendered');
        return (
            <div>
                <h1>blog</h1>
                <LinkParams toParams={{id: 1}} name={'blog 1'}/>
                <LinkParams toParams={{id: 2}} name={'blog 2'}/>
                <LinkParams toParams={{id: 3}} name={'blog 3'}/>
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
            <style>
                {anchorTagResetStyles}
            </style>
            <div style={{display: 'flex', width: '100%'}}>

                {Object.keys({...publicAccess, ...(access.loggedIn ? admin : {})}).map(path => (
                    <Link key={path} toPath={path} name={path} style={{margin: 10, display: 'block'}}/>
                ))}
            </div>

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



