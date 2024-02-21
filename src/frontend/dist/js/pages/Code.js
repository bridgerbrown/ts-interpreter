import hljs from 'highlight.js';

export default class Code extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  async fetchCodeFile() {
    try {
      const response = await fetch('../../interpreter/lexer/lexer.ts');
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const data = await response.text();

      const element = document.querySelector('#code__file-display');
      element.textContent = data;

      hljs.highlightAll();
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  }

  render() {
    const template = document.getElementById("code-page-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);    
    this.fetchCodeFile();
  }
}

customElements.define("code-page", Code);
