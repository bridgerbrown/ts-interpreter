import { Object } from "./object";

export class Environment {
  store: Map<string, Object | null>;
  outer?: Environment | null;
  constructor(outer?: Environment | null) {
    this.store = new Map();
    this.outer = outer;
  }

  get(name: string): Object | null | undefined {
    let obj = this.store.get(name);
    if (!obj) obj = this.outer?.get(name);
    return obj;
  }

  set(name: string, val: Object | null): void {
    this.store.set(name, val);
  }
}
