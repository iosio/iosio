import {x, Element, render, h, createStyleSheet} from "../../src";
import {Root} from "./root";
import {Box} from "./Box";
import {todos} from "@iosio/todos";

// import {Page} from "./page";



import natureImg from './assets/nature.jpg';



const App = x('x-app', class extends Element {

    state = {
        bool: true
    };

    logEvent = ({detail}) => {
        console.log('event detail', detail)
    };

    render({Host, CSS}, {bool}) {

        console.log('app rendered')

        return (
            <Host>

                <CSS/>
                <button onClick={() => {
                    console.log('clicky click')
                    this.setState(({bool}) => ({bool: !bool}))
                }}>
                    toggle bool
                </button>



                {bool &&
                <x-box ontestEvent={this.logEvent} style={'border: 2px solid red; border-radius: 30px'}/>
                }

                <button className={'tester'} onClick={todos.makeABunch}>
                    make a bunch!!!
                </button>


                {/*<img src={natureImg} style={{width: '100%', height: 'auto'}}/>*/}

                {/*/!*----------- todos ----------------*!/*/}


                <div style={{alignSelf: 'flex-start'}}>


                    ... i dare you

                    <br/>
                    <br/>

                    <x-x observe={todos} render={({Host}) => {

                        return (
                            <Host>

                                <input placeholder="add todo" value={todos.todoName}
                                       onInput={(e) => todos.todoName = e.target.value}/>

                                <button onClick={todos.addTodo} style="color:blue">
                                    Add todo !!! :
                                </button>

                                <br/>

                                <input placeholder="search" value={todos.searchValue}
                                       onInput={(e) => todos.setSearchValue(e.target.value)}/>

                            </Host>
                        )
                    }}/>


                    <x-shadow observe={todos} style="width:100%;display:flex" render={() => (
                        <ul>
                            {todos.displayList.map((t) => (
                                <li key={t.id} style={{padding: 20}}>
                                    <button onClick={() => todos.removeTodo(t)}>X</button>
                                    <b>{t.name}</b>
                                </li>
                            ))}

                        </ul>
                    )}/>


                </div>


                {/*/!*----------- todos ----------------*!/*/}


            </Host>
        )
    }
});

render(
    <Root>
        <App/>
    </Root>
    , document.body)
