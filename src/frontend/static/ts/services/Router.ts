const mainElement: HTMLElement | null = document.querySelector("main");
const Router = {
    init: () => {
        document.querySelectorAll("a.navlink").forEach(a => {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                const target = e.target as HTMLElement;
                const href = target.getAttribute("href");
                Router.go(href);
            });
        });  

        window.addEventListener('popstate',  event => {
            Router.go(event.state.route, false);
        });

        Router.go(location.pathname);
    },    
    go: (route: string | null, addToHistory=true) => {
        if (addToHistory) {
            history.pushState({ route }, '', route);
        }
        let pageElement: Node | null = null;
        switch (route) {
            case "/":
                pageElement = document.createElement("demo-view");
                break;
            case "/code":
                pageElement = document.createElement("code-view");
                break;
            case "/how":
                pageElement = document.createElement("how-view");
                break;
            case "/development":
                pageElement = document.createElement("development-view");
                break;
        }
        if (pageElement) {
          if (mainElement) {
            const currentPage = mainElement.firstElementChild; 
            if (currentPage) {
              if (mainElement) mainElement.appendChild(pageElement);
            } else {
              document.querySelector("main")!.appendChild(pageElement);
            }
          }
        }

        window.scrollX = 0;
    }
}

export default Router;
