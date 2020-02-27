import {obi} from "@iosio/obi";
import {isObj} from "@iosio/util";

export const state = obj => (self) =>
    isObj(obj) && self.unsubs.push((self.state = obi(obj)).$onChange(self.onStateChange));