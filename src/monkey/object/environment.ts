import { Object } from "./object";

export class Environment {
  store: Map<string, Object | null>;
  constructor() {
    this.store = new Map();
  }

  get(name: string): Object | null | undefined {
    let obj = this.store.get(name);
    return obj;
  }

  set(name: string, val: Object | null): void {
    this.store.set(name, val);
  }
}
