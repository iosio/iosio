import {obi} from "@iosio/obi";
import {isObj, isFunc} from "@iosio/util";
//
/*

  reactiveState


  properties added:
  state
  onStateChange


 */
export const reactiveProps = ({connected, disconnected}) => {

    const UNSUB_STATE_CHANGE = Symbol();

    connected(self => {
        if (isObj(self.state)) {
            self.state = obi(self.state);
            self[UNSUB_STATE_CHANGE] = self.state.$onChange(
                isFunc(self.onStateChange) ? self.onStateChange : () => this.update && this.update()
            )
        }
    });

    disconnected(self => {
        self[UNSUB_STATE_CHANGE] && self[UNSUB_STATE_CHANGE]();
    })


};
