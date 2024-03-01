export class Environment {
    constructor(outer) {
        this.store = new Map();
        this.outer = outer;
    }
    get(name) {
        let obj = this.store.get(name);
        if (!obj)
            obj = this.outer?.get(name);
        return obj;
    }
    set(name, val) {
        this.store.set(name, val);
    }
}
