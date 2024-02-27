import { initTerminal, resetTerminal, runCommand } from "../services/initTerminal";
import { randomStmt, mathStmt, booleanStmt, ifStmt, letStmt, functionStmt, lenStmt, arrayStmt } from "../data/lines.js";

export default class Demo extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  renderRadio() {
    const types = [
      {
        value: "let",
        display: "Let",
      }, 
      {
        value: "function",
        display: "Function",
      }, 
      {
        value: "len",
        display: "Length",
      }, 
      {
        value: "array",
        display: "Array",
      }, 
      {
        value: "math",
        display: "Math (+, -, *, /)",
      }, 
      {
        value: "boolean",
        display: "Boolean",
      }, 
      {
        value: "if",
        display: "If/Else",
      }, 
      {
        value: "random",
        display: "Random",
      }, 
    ]
    const form = document.querySelector("#demo__form");
    form.innerHTML = "";
    types.forEach((type) => {
      const span = document.createElement("span");
      const i = document.createElement("input");
      i.type = "radio";
      i.className = "demo__types-input";
      i.name = "types";
      i.value = type.value;
      i.id = type.value;
      i.checked = app.statements.type === type.value;
      i.title = "Statement type radio input " + type.value;
      i.alt = "Statement type radio input " + type.value;

      const l = document.createElement("label");
      l.htmlFor = type.value;
      l.className = "demo__types-label";
      l.id = `${type.value}-label`;
      l.innerText = type.display;
      l.title = "Statement type radio label " + type.value;
      l.alt = "Statement type radio label " + type.value;
      span.appendChild(i);
      span.appendChild(l);

      form.appendChild(span);
      l.addEventListener("click", (event) => {
        app.statements.type = type.value;
      });
      i.addEventListener("click", (event) => {
        app.statements.type = type.value;
        console.log(type.value);
      });
    });
  }

  randomStatement(type) {
    let command = "";
    switch (type) {
      case ("let"):
        this.generateStatement(letStmt); 
        break; 
      case ("function"):
        this.generateStatement(functionStmt); 
        break;
      case ("len"):
        this.generateStatement(lenStmt); 
        break;
      case ("array"):
        this.generateStatement(arrayStmt); 
        break;
      case ("math"):
        this.generateStatement(mathStmt); 
        break;
      case ("boolean"):
        this.generateStatement(booleanStmt); 
        break;
      case ("if"):
        this.generateStatement(ifStmt); 
        break;
      case ("random"):
        this.randomType(); 
        break;
    } 
    runCommand(command); 
  }

  generateStatement(type) {
    const random = Math.floor(Math.random() * (type.length - 1));
    const selected = type[random];
    const split = selected.split('');
    for (let i = 0; i < split.length; i++) {
      if (split[i] === 'x' ) {
        split[i] = Math.floor(Math.random() * 50) + 1;
      }
    }
    console.log(split.join(''));
    return split.join('');
  }

  randomType() {
    const random = Math.floor(Math.random() * (randomStmt.length - 1));
    const selected = randomStmt[random];
    this.randomStatement(selected);
  }

  render() {
    const template = document.getElementById("demo-page-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);    

    initTerminal();

    this.renderRadio();

    const resetBtn = document.querySelector("#demo__button-reset");
    resetBtn.addEventListener("click", () => { resetTerminal() });
    const randomBtn = document.querySelector("#demo__button-random");
    randomBtn.addEventListener("click", () => { this.randomStatement(app.statements.type) });
  }
}

customElements.define("demo-page", Demo);
