import Router from "./services/Router";

interface WindowApp extends Window {
  app: {
    router: typeof Router;
  }
}

const app: WindowApp['app'] = {} as WindowApp['app'];

declare global { 
  interface HTMLElement {
    $: (selectors: string) => Element | null;
    $$: (selectors: string) => NodeListOf<Element>;
    on: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
    off: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
  }
}

const $ = (selectors: string) => document.querySelector(selectors);
const $$ = (selectors: string) => document.querySelectorAll(selectors);

HTMLElement.prototype.$ = function(this: HTMLElement, selectors: string) {
  return this.querySelector(selectors);
};

HTMLElement.prototype.$$ = function(this: HTMLElement, selectors: string) {
  return this.querySelectorAll(selectors);
};

HTMLElement.prototype.on = function(this: HTMLElement, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
  this.addEventListener(type, listener, options);
};

HTMLElement.prototype.off = function(this: HTMLElement, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
  this.removeEventListener(type, listener, options);
};

app.router = {} as typeof Router;

window.addEventListener("DOMContentLoaded", () => {
  app.router.init();
});


