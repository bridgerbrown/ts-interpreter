import Router from './services/Router.js';

import Home from './pages/Home.js';

window.app = {}

const $ = () => document.querySelector.call(this, arguments);
const $$ = () => document.querySelectorAll.call(this, arguments);
HTMLElement.prototype.on = () => this.addEventListener.call(this, arguments);
HTMLElement.prototype.off = () => this.removeEventListener.call(this, arguments);
HTMLElement.prototype.$ = () => this.querySelector.call(this, arguments);
HTMLElement.prototype.$ = () => this.querySelectorAll.call(this, arguments);

app.router = Router;

window.addEventListener("DOMContentLoaded", () => {
  app.router.init();
});
