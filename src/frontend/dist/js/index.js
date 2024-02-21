import Home from './pages/Home.js';
import Code from './pages/Code.js';

window.app = {}

HTMLElement.prototype.on = () => this.addEventListener.call(this, arguments);
HTMLElement.prototype.off = () => this.removeEventListener.call(this, arguments);
HTMLElement.prototype.$ = () => this.querySelector.call(this, arguments);
HTMLElement.prototype.$$ = () => this.querySelectorAll.call(this, arguments);

const router = {
  init: () => {
    document.querySelectorAll("a.navlink").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        router.go(href);
      });
    });  

    window.addEventListener('popstate',  event => {
      router.go(event.state.route, false);
    });

    router.go(location.pathname);
  },    
  go: (route, addToHistory=true) => { 
    if (addToHistory) history.pushState({ route }, '', route);

    let pageElement = null;
    switch (route) {
      case "/demo":
        pageElement = document.createElement("demo-page");
        break;
      case "/code":
        pageElement = document.createElement("code-page");
        break;
      case "/development":
        pageElement = document.createElement("development-page");
        break;
      case "/":
        pageElement = document.createElement("home-page");
        break;
    }
    if (pageElement) {
      const currentPage = document.querySelector("main").firstElementChild;
      if (currentPage) {
        currentPage.remove();
      }
      document.querySelector("main").appendChild(pageElement);
    }
    window.scrollX = 0;
  }
}

app.router = router;

window.addEventListener("DOMContentLoaded", () => {
  router.init();
});


