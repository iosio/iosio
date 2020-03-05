import {Elemental, h} from "@iosio/elemental";

class Page4 extends Elemental {
    render() {
        return (
            <h1>Page 4!!</h1>
        )
    }
}

customElements.define('page-four', Page4);

export default Page4