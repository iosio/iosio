import {render, h, x, headStyleTag, Element} from "@iosio/x";
import {CustomElementsRouter, routing} from "@iosio/custom-elements-router";
import {lazyMap, pathMap} from "./lazyPages/dynamicImports";

const globalStyles = headStyleTag();

globalStyles(/*language=CSS*/jcss`
    html, body {
        overflow: hidden;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100vh;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }
`);


let router = CustomElementsRouter({
    // loadingIndicator: 'x-circle-loader', // web component tag name of some kind of loading indicator
    noMatch: '/',
    pathMap,
    lazyMap
});

export const GradientBG = x('gradient-bg', ({Host, CSS}) => (
    <Host>
        <CSS>{/*language=CSS*/jcss`
            :host {
                width: 100%;
                height: 100vh;
            }

            :host {
                background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
                background-size: 400% 400%;
                animation: gradientBG 15s ease infinite;
            }

            @keyframes gradientBG {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }

        `}</CSS>

        <slot/>

    </Host>
), {shadow: true});


export const App = x('x-app', class extends Element {

    didMount() {
        router.mountTo(() => this.pageRef);
    }

    render({Host, CSS}) {

        return (

            <Host>

                <CSS>{/*language=CSS*/jcss`

                    x-app {
                        width: 100%;
                        height: 100vh;
                        font-family: 'Montserrat', "Helvetica Neue", -apple-system, "Segoe UI", "Roboto", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                        color: #fff;
                    }

                    x-app, .page, .page > * {
                        width: 100%;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                    }

                    .page > * {
                        font-size: 80px;
                    }

                    .btn {
                        display: inline-block;
                        margin: 20px 10px;
                        padding: 10px 20px;
                        background: white;
                        color: black;
                        border-radius: 20px;
                        cursor: pointer;
                        user-select: none;
                    }

                    .nav {
                        position: fixed;
                        top:0;
                        left:0;
                    }

                `}</CSS>

                <GradientBG>

                    <div className={'nav'}>
                        <div className={'btn'} onClick={() => routing.route('/')}>
                            create x project
                        </div>

                        <div className={'btn'} onClick={() => routing.route('/about')}>
                            about
                        </div>
                    </div>

                    <div className="page" ref={r => this.pageRef = r}/>

                </GradientBG>

            </Host>
        )
    }
});


render(<App/>, document.body);