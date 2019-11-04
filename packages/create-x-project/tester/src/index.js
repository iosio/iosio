import {render, h, x, headStyleTag} from "@iosio/x";

import './index.css';

const globalStyles = headStyleTag();

globalStyles(/*language=CSS format=true*/jcss`
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

export const App = x('x-app', ({Host, CSS}) => (

    <Host>

        <CSS>{/*language=CSS*/jcss`

            :host{
                width: 100%;
                height: 100vh;
                font-family: 'Montserrat', "Helvetica Neue", -apple-system, "Segoe UI", "Roboto", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                color: #fff;
            }

            :host {
                background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
                background-size: 400% 400%;
                animation: gradientBG 15s ease infinite;
                display: flex;
                align-items: center;
                justify-content: center;
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

            h1 {
                font-size: 400px;
            }

        `}</CSS>

        <h1>X</h1>

    </Host>

), {shadow: true});

render(<App/>, document.body);