import {webComponentTester} from "../testing/testUtils/webComponentsTester";


webComponentTester({
    tag: 'x-box',
    tests: [
        async ({component: c, until}) => {
            await until(1000);
            c.setAttribute('hello', 'fuck');
            await until(1000);
            // c.remove();
        }
    ]
});