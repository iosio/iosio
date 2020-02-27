```if (customElements) {
    console.log('custom elements')
    try {
        document.body.textContent = 'trying one'
        // feature detect browsers that "forgot" 🙄 to implement built-in extends


    } catch(_) {
        document.body.textContent = 'trying 2'
        // only WebKit or Safari
        document.write('<script src="//unpkg.com/@ungap/custom-elements-builtin"><\script>');

        customElements.define('built-in', document.createElement('p').constructor, {'extends':'p'});
        let p = document.createElement('p');
        p.is = 'built-in';
        document.appendChild()
    }
} else {
    document.body.textContent = 'trying 3'
    // only legacy browsers
    document.write('<script src="//unpkg.com/document-register-element"><\script>');
}
```
//https://github.com/ungap/custom-elements-builtin#custom-elements-with-builtin-extends