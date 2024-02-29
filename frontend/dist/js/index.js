import HomePage from './pages/HomePage.js';
import TestPage from './pages/TestPage.js';
import CodePage from './pages/CodePage.js';
import DevPage from './pages/DevPage.js';
import expressiontype from './services/expressiontype.js';
import { animate } from 'motion';

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
  
  headerAnimate();
  const header = document.querySelector("header h1")
  const mouseOverEvent = new MouseEvent("mouseover", {
    bubbles: true, // Whether the event should bubble up through the DOM or not
    cancelable: true, // Whether the event is cancelable or not
  });
  header.dispatchEvent(mouseOverEvent);
});

function headerAnimate() {
  const chars = [
    "0", "1", "$", "#", "@", "?", "%", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z", "&",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z"
  ];
  let interval = null;

  document.querySelector("header h1").onmouseover = (e) => {
    let iteration = 0;
    clearInterval(interval);
    
    interval = setInterval(() => {
      e.target.innerText = e.target.innerText.split("").map((letter, i) => {
        if (i < iteration) {
          return e.target.dataset.value[i];
        }
        let charReplacement;
        if (/\s/.test(letter)) {
          charReplacement = letter; 
        } else {
          charReplacement = chars[Math.floor(Math.random() * chars.length)];
        }
        return charReplacement;
      }).join("");

      if (iteration >= e.target.dataset.value.length) {
        clearInterval(interval)
      }
      iteration += 1;
    }, 70);
  }
}
