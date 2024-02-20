export default class Demo extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    const template = document.getElementById("demo-page-template") as HTMLTemplateElement;
    const content = template.content.cloneNode(true);
    this.appendChild(content);
  }
}

customElements.define("demo-page", Demo);
