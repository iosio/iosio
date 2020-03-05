# @iosio/elemental

> Web Component Essentials with built-in adoptable styleSheets (including fallback),
> static template caching, 
> a 1.5kb vdom, and more...

## Installation
```sh 
npm install @iosio/elemental
```

## Usage
```js
import {Elemental, h, Fragment} from "@iosio/elemental";

export class MyComponent extends Elemental{
    //set to true to apply shadowdom
    static shadow = true;
    /* 
     Component will check for adopted stylesheets 
     and if not available will append a style tag to the root/shadowRoot.
        
     optionally set static styles as a string
     static styles = ':host{background:aliceblue}';
    */
    //or an object with options
    static styles = {
        // styles to adopt to each instance of this component 
        // (efficiently achieved with adoptedStyleSheets),
        css: ':host{color:red}',
        // async: true, // constructable style sheet option. async true uses replace else replaceSync 
 
        // you can force the usage of the style tag over adoptedStyleSheets
        // useStyleTag: true,
 
        // optionally include global styles that will be set once to the document head
        global: 'x-element{visibility:hidden}',
        
        //if using shadowRoot, some resets are included by default
        //:host, *, *::before, *::after {box-sizing: border-box;}
        //set this to true to disable using the resets
        //noDefaultResets: true,
    };

    /*  
        If your component is simple and doesn't update much, it might be more performant 
        to use a template instead of JSX, since a copy is cached and cloned per instance.
        this is is a static value but dom may be updated manually in beforeInitialUpdate and after didMount.
        or with propLogic
    */
    static template = '<h1 id="my_ref">hello elemental</h1><input id="checkbox" type="checkbox"/>';
    
    /*
        (this makes sense if using a template and not vdom bacuse you can just pass a function to the ref prop)
        to automatically proxy elements references, 
        set this to true or an options object to override defaults.
        * keep your ref names camel or snake cased
        
        when the component mounts, reference to the h1 tag above will be available on:
        this.refs.my_ref.
        
        (if completely wiping out the dom or updating nodes, you can call:
            this.refs.refreshRefsCache()
        to pull new references)
    */
    static proxyRefs = {
        //(default) likely there will be shadowDom so the default selector is set to get by id
        selector: ref => `#${ref}`, // can change to something like (ref) => `[data-${ref}]`
        selectorMethod: 'querySelector', // chang change to something like querySelectorAll
    };   
    
    /*
        propTypes
        define all your properties with types, optionally with a default value 
        and optional reflect property to reflect your props as attrs.

        (if reflected:true) 
        When a prop is set, it will update the corresponding attribute to kabob-case version 
        
        in addition, properties on the class will be updated when attributes are set 
        (this is by default without setting the reflect option)
        
    */
   
    static propTypes = {

        myStringProp: String,
        myBooleanProp: Boolean,
        myNumberProp: Number,
        myObjectProp: Object,
        myArrayProp: Array,
        anyValueGoesProp: 'any',

        toBeReflected: {
            type: String,
            reflect: true
        },

        toBeReflectedWithDefaultValue: {
            type: Boolean,
            reflect: true,
            value: true
        },
        checked: {
            type: Boolean,
            reflect: true,
        }
    };

    /*
        State - (uses @iosio/obi)

        state can be updated by simply "dot-walking" out from at least one property,
        and assigning a new value to that property.

        for example:

            const {state} = this;
            state.count++; // this will trigger an update

            const {count} = state;
            count++; // this will not!

       this.state.count = this.state.count + 10;// this will work too, etc..

        by default, changes will call this.update (thus calling didUpdate, render (if using vdom), and propLogic), 
        but you may override onStateChange so that it is called only 
    */
    state = {
        count: 0
    };   
    
    // before didMount gets called 
    // (if using a template) called after the template is applied, but before didMount and propLogic
    beforeInitialUpdate(){
    }
    

    //example handle click without jsx
    handleClick = (e) => {
        e.stopPropagation();
        let c = this.refs.checkbox.checked;
        this.checked = c;
        this.emit('change', {checked: c});
    };

    didMount() {
        // this.eventListener will automatically remove the event listener when the component unmounts
        this.eventListener(this.refs.checkbox, 'click', this.handleClick);
        // all subscriptions (like the event listener above) are pushed into this.unsubs.
        /*
            //here is an example of doing the above manually

            this.checkbox = this.shadowRoot.querySelector("#checkbox");
            this.checkbox.addEventListener("click", this.handleClick);
            this.unlisten = () => this.checkbox.removeEventListener("click", this.handleClick);
            // then either push it into unsubs 
            this.unsubs.push(this.unlisten)
            // or call unlisten inside willUnmount() 
        */ 
    }
    
    willUnmount(){
        // this.unlisten();
    }

    onStateChange(state, changedPaths = ['nested.value']){ //array of values that have changed on the object

        //if including this method, it will override calling update (thus wont call render, propLogic and didUpdate)
        // so manually calling this.update() here may be necessary (must do so if using the render function with vdom)
        // otherwise, omit this method and render will be called onChange
    }

    // called when props or state changes (unless onStateChange is overriden like above)
    didUpdate(props = {}, prevProps = {}, changedProps = ['myStringProp', 'example']){
    }   

    //****** using propLogic makes sense if using a template and you don't have a lot of changes happening.
    // Make precise updates based on which prop changes
    propLogic = (init)=>({ // initially runs after didMount (init===true) then is triggered for every update (init===false) 
        myStringProp: (value, refs) => {
            if(init){ //upon didMount
                refs.my_ref.textContent = value || 'default name'; //value is the value from the prop
            }else{ 
                // subsequent updates 
            }
        },
        // this both initializes and updates the checkbox when the prop changes
        checked: (checked, {checkbox}) => checkbox.checked = checked
    });

    render(props, state){
        
        // JSX syntax is just like Preact pretty much, (refs are always functions)
        return (
            <Fragment>
                <h1 ref={r => this.my_ref = r} style={{color: 'red', fontSize: 50 /*no need for pixel vaue*/}}>
                    hello: {props.myStringProp} 
                </h1>
                 <h2 style={{color: 'blue'}} className={'some className'}>
                        {state.count}
                 </h2>
                <button onClick={()=> state.count++}> inc count +</button>
            </Fragment>
        )   
    }   
}

customElements.define('my-component', MyComponent);
```


