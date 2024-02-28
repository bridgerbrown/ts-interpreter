export default class DevPage extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    const template = document.getElementById("dev-page-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);    
  }
}

customElements.define("dev-page", DevPage);
