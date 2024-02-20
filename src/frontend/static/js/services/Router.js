const Router = {
  init: () => {
    document.querySelectorAll("a.navlink").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target instanceof Element) {
          const href = e.target.getAttribute("href");
          Router.go(href);
        }
      });
    });  

    window.addEventListener('popstate',  event => {
      Router.go(event.state.route, false);
    });

    Router.go(location.pathname);
  },    
  go: (route, addToHistory=true) => {
    if (addToHistory) {
      history.pushState({ route }, '', route);
    }
    let pageElement;
    switch (route) {
      case "/":
        pageElement = document.createElement("home-page");
        break;
      case "/demo":
        pageElement = document.createElement("demo-page");
        break;
      case "/code":
        pageElement = document.createElement("code-page");
        break;
      case "/development":
        pageElement = document.createElement("development-page");
        break;
    }
    if (pageElement) {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.appendChild(pageElement);
      }
    }
    window.scrollX = 0;
  }
}

export default Router;
