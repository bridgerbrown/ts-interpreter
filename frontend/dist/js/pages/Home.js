export default class Home extends HTMLElement {
  connectedCallback() {
    this.render()
  }
  render() {
    const template = document.getElementById("home-page-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);    
  }
}

customElements.define("home-page", Home);
