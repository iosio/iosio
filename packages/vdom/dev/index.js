import {todos} from "@iosio/todos";

import {Fragment, h, render} from "../src"

const Input = () => (
    <input placeholder={'search list!!!'} value={todos.searchValue}
           onInput={(e) => todos.setSearchValue(e.target.value)}/>
);


const Counter = (props, {count = 0}, update) => {
    return (
        <div>
            <button onclick={() => update({count: count + 1})} subs={['heyyo']}>
                inc me !
            </button>
            <h3>{count}</h3>
        </div>
    )
};


const svgString = /*language=HTML format=true*/`\
<svg width="45" height="45" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="black">
    <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
        <circle cx="22" cy="22" r="6" stroke-opacity="0">
            <animate attributeName="r"
                     begin="1.5s" dur="3s"
                     values="6;22"
                     calcMode="linear"
                     repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity"
                     begin="1.5s" dur="3s"
                     values="1;0" calcMode="linear"
                     repeatCount="indefinite"/>
            <animate attributeName="stroke-width"
                     begin="1.5s" dur="3s"
                     values="2;0" calcMode="linear"
                     repeatCount="indefinite"/>
        </circle>
        <circle cx="22" cy="22" r="6" stroke-opacity="0">
            <animate attributeName="r"
                     begin="3s" dur="3s"
                     values="6;22"
                     calcMode="linear"
                     repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity"
                     begin="3s" dur="3s"
                     values="1;0" calcMode="linear"
                     repeatCount="indefinite"/>
            <animate attributeName="stroke-width"
                     begin="3s" dur="3s"
                     values="2;0" calcMode="linear"
                     repeatCount="indefinite"/>
        </circle>
        <circle cx="22" cy="22" r="8">
            <animate attributeName="r"
                     begin="0s" dur="1.5s"
                     values="6;1;2;3;4;5;6"
                     calcMode="linear"
                     repeatCount="indefinite"/>
        </circle>
    </g>
</svg>`;

const SVG = () => (
    <div dangerouslySetInnerHTML={{__html: svgString}}/>
);

const App = (props, {count = 0, show = false}, update) => {
    return (
        <Fragment>

            <style>{`.yoyo{background:green}`}</style>

            <div>

                <button className={'yoyo'} onClick={() => update({show: !show})}>
                    show!
                </button>

                <Fragment>

                    <Counter/>

                    <h1>---------- another counter ----------</h1>
                </Fragment>


                <button onClick={() => update({count: count + 1})} style={{background: 'red'}}>
                    inc me !
                </button>

                <h3 style="color:red">{count}</h3>

                <button onclick={() => todos.makeABunch()}>
                    makeabunch
                </button>

                <input placeholder={'new todo'} value={todos.todoName} oninput={(e) => {
                    todos.todoName = e.target.value;
                }}/>

                <button onclick={() => {
                    todos.addTodo();
                }}>
                    add todo
                </button>

                <Input/>

                <SVG/>

                {show &&

                <ul>
                    {todos.displayList.map((item, i) => (
                        <li key={item.id}>
                            {item.name}
                            <Counter/>
                        </li>
                    ))}
                </ul>
                }
            </div>
        </Fragment>

    )
};


const update = () => {
    render(<App/>, document.body);
};

todos.$onChange(update);

update();

