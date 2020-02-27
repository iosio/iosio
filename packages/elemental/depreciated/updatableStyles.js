import {createStyleTag} from "./util";

export const updatableStyles = base => class extends base {
    constructor() {
        super();
        let updatableStyleTag;
        this.updateStyles = () => {
            if (this.updatableStyles) {
                let css = this.updatableStyles(this.props, this.prevProps);
                if (!css) return;
                if (!updatableStyleTag) {
                    updatableStyleTag = createStyleTag(css);
                    (this.shadowRoot || this).appendChild(updatableStyleTag.element)
                } else updatableStyleTag.update(css);
            }
        };
    }
};