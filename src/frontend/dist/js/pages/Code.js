import hljs from 'highlight.js';

export default class Code extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  async fetchCodeFile(name) {
    try {
      const response = await fetch(`../../interpreter/${name}`);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const data = await response.text();

      const element = document.querySelector('#code__file-display');
      element.textContent = data;
      
      element.dataset.highlighted = "";
      hljs.highlightAll();

      const heading = document.querySelector("#code__file-display-container p");
      heading.textContent = name;
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  }

  render() {
    const template = document.getElementById("code-page-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);    
    
    this.fetchCodeFile("lexer/lexer.ts");

    const filesLi = document.querySelectorAll(".ft__files li");
    filesLi.forEach((li) => {
      li.addEventListener("click", () => this.fetchCodeFile(li.dataset.ftFilepath))
    });

  }
}

customElements.define("code-page", Code);
