import {CustomElementsRouter, routing} from "../src";
import {Elemental, h, Fragment, mount} from "@iosio/elemental";

customElements.define('page-one', class extends Elemental {
    render() {
        return (
            <h1>Page 1!!</h1>
        )
    }
});

customElements.define('page-two', class extends Elemental {
    render() {
        return (
            <h1>Page 2!!</h1>
        )
    }
});

customElements.define('page-three', class extends Elemental {
    render() {
        return (
            <h1>Page 3!!</h1>
        )
    }
});

let router = CustomElementsRouter({
    transition: true,
    pathMap: {
        '/': 'page-one',
        '/2': 'page-two',
        '/3': 'page-three',
        '/4': 'page-four'
    },
    lazyMap: {
        'page-four': () => import('./lazy-page-four')
    }
});

let mounted, node, unsub;


const useRef = (ref) => {
    if (!mounted) {
        node = ref;
        unsub = router.mountTo(() => node);
        mounted = true;
    }
    node = ref;
};


mount(document.body,
    <Fragment>
        <nav style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
            <div onClick={() => routing.route('/')}>page 1</div>
            <div onClick={() => routing.route('/2')}>page 2</div>
            <div onClick={() => routing.route('/3')}>page 3</div>
            <div onClick={() => routing.route('/4')}>page 4</div>
        </nav>
        <div ref={r => useRef(r)}/>
    </Fragment>
);


