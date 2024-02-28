import HomePage from './pages/HomePage.js';
import TestPage from './pages/TestPage.js';
import CodePage from './pages/CodePage.js';
import DevPage from './pages/DevPage.js';
import expressiontype from './services/expressiontype.js';

window.app = {}
app.expressiontype = expressiontype;

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
      case "/test":
        pageElement = document.createElement("test-page");
        break;
      case "/code":
        pageElement = document.createElement("code-page");
        break;
      case "/development":
        pageElement = document.createElement("dev-page");
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
