import { initTerminal } from "../services/Terminal";

export default class Demo extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    const template = document.getElementById("demo-page-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);    

    initTerminal();
  }
}

customElements.define("demo-page", Demo);
