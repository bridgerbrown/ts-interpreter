import Home from './pages/Home.js';
import Demo from './pages/Demo.js';
import Code from './pages/Code.js';
import statements from './services/statements.js';

window.app = {}

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
app.statements = statements;

window.addEventListener("DOMContentLoaded", () => {
  router.init();
});
