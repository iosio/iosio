import {render, h, x, headStyleTag, Element} from "@iosio/x";

import {FuseWorker} from "../src";

const globalStyles = headStyleTag();

globalStyles(/*language=CSS*/jcss`
    html, body {
        overflow: hidden;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }
`);


export const App = x('x-app', class extends Element {

    didMount() {
        import('./first-names.js').then((module) => {
            this.fuse = FuseWorker({
                workerURL: './fuse.worker.js',
                list: module.default,
                options: {keys: Object.keys(module.default[0])}
            });
            this.setState({displayList: module.default});
        })
    }

    state = {
        searchValue: '',
        displayList: false
    };

    updateList = (value) => {
        this.setState({searchValue: value});
        this.fuse.search(value, (results) => {
            this.setState({displayList: results});
        })
    };

    render({Host, CSS}, {searchValue, displayList}) {

        return (

            <Host>

                <CSS>{/*language=CSS*/jcss`

                    x-app {
                        display: block;
                        width: 100%;
                        font-family: 'Montserrat', "Helvetica Neue", -apple-system, "Segoe UI", "Roboto", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                        height: 100%;
                        overflow: auto;
                    }


                    .page {
                        padding-top: 70px;
                        display: flex;
                        width: 100%;
                        flex-direction: column;
                    }

                    .listItem {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .item {
                        display: flex;
                        text-align: left;
                        width: ${100 / 7}%;
                    }

                    nav{
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 56px;
                    }
                `}</CSS>

                <nav>
                    {displayList &&
                    <input value={searchValue}
                           onInput={({target}) => this.updateList(target.value)}/>
                    }
                </nav>
                <div className={'page'}>

                    {displayList && displayList.map((item, i) => (
                        <div className={'listItem'} key={i}>
                            {item.name}
                            {/*{Object.keys(item).map((itemName, j) => (*/}
                            {/*<div className={'item'} key={j}>*/}
                            {/*{item[itemName]}*/}
                            {/*</div>*/}
                            {/*))}*/}
                        </div>
                    ))}
                </div>

            </Host>
        )
    }
});


render(<App/>, document.body);