import {obi} from "@iosio/obi";
import {isObj} from "@iosio/util";

export const state = () => (self) =>{
    console.log(self.state);
    self.initialized.then(()=>{
        if(isObj(self.state)){
            self.state = obi(self.state);
            self.unsubs.push(self.state.$onChange(self.onStateChange));
        }
    })
}