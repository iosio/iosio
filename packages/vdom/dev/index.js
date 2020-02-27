// import {todos} from "@iosio/todos";
// import {Component, Fragment, h, renderer, mount} from "@iosio/elemental";
// import {obi} from '@iosio/obi'
// import {d} from "@iosio/util";
//
//
// const TestBox = ({children}) => (
//     <div style={{width: '50%'}}>
//         {children}
//     </div>
// );
//
// const Derp = ({state}) => (
//     <Fragment>
//         <input value={state.value} onInput={e => state.value = e.target.value}/>
//     </Fragment>
// );
//
//
// class TodoInput extends Component {
//     // static shadow = true;
//     state = todos;
//     // state = {value: ''}
//
//     static styles = /*language=CSS*/jcss`
//         .derp {
//             background: aliceblue;
//         }
//     `;
//
//     render(props, state) {
//         return (
//             <v-root>
//                 <input placeholder={'search list!!!'}
//                        value={todos.searchValue}
//                        onInput={(e) => todos.setSearchValue(e.target.value)}/>
//             </v-root>
//         )
//     }
// }
//
// customElements.define('todo-input', TodoInput);
//
//
// class xElement extends Component {
//     constructor(props) {
//         super(props);
//     }
//
//     static propTypes = {
//         // render: Function,
//         observe: Object,
//         connected: Boolean,
//     };
//
//     didMount() {
//         const {observe} = this.props;
//         if (observe && observe.$onChange) {
//             console.log('is observing')
//             this.unsubs.push(observe.$onChange(() => {
//                 this.update();
//             }))
//         }
//     }
// }
//
// customElements.define('x-connect', xElement);
//
// const connect = (observe) => {
//
//     return (Comp) => {
//
//
//         return (props) => {
//
//             return null
//             // return (
//             //     <x-connect
//             //         connected={true}
//             //         observe={observe}
//             //         render={() => <Comp {...observe} {...props}/>}/>
//             // )
//         }
//     };
// }
//
// const count = obi({num: 0});
//
// const Counter = (props) => {
//     <div>
//         <h1>I am a counter!! my count ---{props.num}</h1>
//     </div>
// };
// const ConnectedCounter = connect(count)(Counter);
//
// // console.log(typeof Counter)
//
// const svgString = /*language=HTML format=true*/`\
// <svg width="45" height="45" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="black">
//     <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
//         <circle cx="22" cy="22" r="6" stroke-opacity="0">
//             <animate attributeName="r"
//                      begin="1.5s" dur="3s"
//                      values="6;22"
//                      calcMode="linear"
//                      repeatCount="indefinite"/>
//             <animate attributeName="stroke-opacity"
//                      begin="1.5s" dur="3s"
//                      values="1;0" calcMode="linear"
//                      repeatCount="indefinite"/>
//             <animate attributeName="stroke-width"
//                      begin="1.5s" dur="3s"
//                      values="2;0" calcMode="linear"
//                      repeatCount="indefinite"/>
//         </circle>
//         <circle cx="22" cy="22" r="6" stroke-opacity="0">
//             <animate attributeName="r"
//                      begin="3s" dur="3s"
//                      values="6;22"
//                      calcMode="linear"
//                      repeatCount="indefinite"/>
//             <animate attributeName="stroke-opacity"
//                      begin="3s" dur="3s"
//                      values="1;0" calcMode="linear"
//                      repeatCount="indefinite"/>
//             <animate attributeName="stroke-width"
//                      begin="3s" dur="3s"
//                      values="2;0" calcMode="linear"
//                      repeatCount="indefinite"/>
//         </circle>
//         <circle cx="22" cy="22" r="8">
//             <animate attributeName="r"
//                      begin="0s" dur="1.5s"
//                      values="6;1;2;3;4;5;6"
//                      calcMode="linear"
//                      repeatCount="indefinite"/>
//         </circle>
//     </g>
// </svg>`;
//
// const SVG = () => (
//     <v-root dangerouslySetInnerHTML={{__html: svgString}}/>
// );
//
//
// customElements.define('ripples-icon', class extends Component {
//     render() {
//         return (
//             <SVG/>
//         )
//     }
// });
//
//
// class TodoComponent extends Component {
//     static shadow = true;
//     state = todos;
//
//     constructor() {
//         super();
//         const template = (t => ((t.innerHTML = `<style>.derp{background: lightpink}</style>`, t)))(d.createElement('template'));
//         this.shadowRoot.appendChild(template.content.cloneNode(true));
//     }
//
//     // state = {value: '', count: 0}
//
//     didMount() {
//         console.log('did mount')
//     }
//
//     static styles = /*language=CSS*/jcss`
//         todo-component {
//             display: block;
//         }
//
//         .derp {
//             background: aliceblue;
//         }
//     `;
//
//     render(props, state) {
//         console.log('rendered todo component')
//
//         return (
//             <Fragment>
//                 <h1>hellooo</h1>
//                 <h1 style={{
//                     background: todos.searchValue.length % 2 ? 'black' : 'white',
//                     color: todos.searchValue.length % 2 ? 'white' : 'black'
//                 }}>
//                     hello world!
//                 </h1>
//
//                 <button onClick={() => todos.makeABunch()}>
//                     makeabunch
//                 </button>
//
//                 {/*<todo-input/>*/}
//                 <input placeholder={'search list!!!'} value={todos.searchValue}
//                        onInput={(e) => todos.setSearchValue(e.target.value)}/>
//
//
//
//                 <div style={{height: 100, width: '100%'}}>
//                     {!!(todos.searchValue.length % 2) && <div dangerouslySetInnerHTML={{__html: svgString}}/>}
//                 </div>
//                 {/*<ConnectedCounter/>*/}
//
//                 {/*<x- observe={count} render={() => {*/}
//                 {/*    console.log('rendering button')*/}
//                 {/*    return (*/}
//                 {/*        <div>*/}
//                 {/*            hello*/}
//                 {/*            <button onClick={() => count.num = count.num + 1}>*/}
//                 {/*                count: {count.num}*/}
//                 {/*            </button>*/}
//                 {/*        </div>*/}
//                 {/*    )*/}
//                 {/*}}/>*/}
//
//
//                 {/*<div style={{display: 'flex'}} className={'derp'}>*/}
//                 {/*    <TestBox>*/}
//
//                 {/*        <ul>*/}
//                 {/*            <Fragment>*/}
//                 {/*                {todos.displayList.map((item, i) => (*/}
//                 {/*                    <li key={item.id}>*/}
//                 {/*                        {item.name}*/}
//                 {/*                        <ripples-icon/>*/}
//                 {/*                    </li>*/}
//
//                 {/*                ))}*/}
//                 {/*            </Fragment>*/}
//                 {/*        </ul>*/}
//
//                 {/*    </TestBox>*/}
//
//                 {/*    <TestBox>*/}
//                 {/*        <ul>*/}
//                 {/*            <Fragment>*/}
//                 {/*                {todos.displayList.map((item, i) => (*/}
//                 {/*                    <li key={item.id}>*/}
//                 {/*                        {item.name}*/}
//
//                 {/*                    </li>*/}
//                 {/*                ))}*/}
//                 {/*            </Fragment>*/}
//                 {/*        </ul>*/}
//                 {/*    </TestBox>*/}
//                 {/*</div>*/}
//             </Fragment>
//         )
//
//     }
// }
//
// customElements.define('todo-component', TodoComponent);
// // document.body.appendChild(document.createElement('todo-component'));
// mount(document.body, (
//     <Fragment>
//         <h1>hello App</h1>
//         <todo-component/>
//     </Fragment>
// ));
//
// /*
//      <input value={state.value} onInput={e => state.value = e.target.value}/>
//
//
//
//  */