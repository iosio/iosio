/**
 * asyncBatchUpdate
 * batches (or debounces) several sequential updates into a single update.
 * Also acts as async rendering
 *
 * @example - see test file for more detailed info
 *
 * @property this.mount
 * - call this when the component is connected. resolves the pending promise.
 *
 * @property this.mounted (ex: this.mounted.then(()=> doSomethingWhenMounted());)
 * - pending promise. used to debounce sequential updates, as well as a callback for when the component mounts
 *
 * @property this.update - request for an update callback. calls this.onUpdate if available on the class;
 *
 */
export const asyncBatchUpdate = ({construct}) => {
    construct(self => {
        self.mounted = new Promise(mount => (self.mount = mount));
        self.update = () => !self.processing && (self.processing = self.mounted.then(_ => {
            self.onUpdate && self.onUpdate();
            self.processing = false;
        }), self.processing);
    })
};