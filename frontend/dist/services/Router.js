"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Router = {
    init: function () {
        document.querySelectorAll("a.navlink").forEach(function (a) {
            a.addEventListener("click", function (e) {
                e.preventDefault();
                var target = e.target;
                var href = target.getAttribute("href");
                Router.go(href);
            });
        });
        window.addEventListener('popstate', function (event) {
            Router.go(event.state.route, false);
        });
        Router.go(location.pathname);
    },
    go: function (route, addToHistory) {
        if (addToHistory === void 0) { addToHistory = true; }
        if (addToHistory) {
            history.pushState({ route: route }, '', route);
        }
        var pageElement = null;
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
            var mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.appendChild(pageElement);
            }
        }
        window.scrollX = 0;
    }
};
exports.default = Router;
