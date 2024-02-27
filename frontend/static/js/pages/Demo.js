import Terminal, { initTerminal, resetTerminal, runRandomCommand } from "../services/initTerminal";
import { randomStmt, mathStmt, booleanStmt, ifStmt, letStmt, functionStmt, lenStmt, arrayStmt } from "../data/lines.js";
import statements from '../services/statements.js';

export default class Demo extends HTMLElement {
  constructor() {
    super();
    this.isAppended = false;
    this.terminal = new Terminal();
  }

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
      }
    ]
    const form = document.querySelector("#demo__form");
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
    let command;
    const { runRandomCommand } = this.terminal;
    switch (type) {
      case ("let"):
        command = this.generateStatement(letStmt); 
        runRandomCommand(command);
        break; 
      case ("function"):
        command = this.generateStatement(functionStmt); 
        runRandomCommand(command);
        break;
      case ("len"):
        command = this.generateStatement(lenStmt); 
        runRandomCommand(command);
        break;
      case ("array"):
        command = this.generateStatement(arrayStmt); 
        runRandomCommand(command);
        break;
      case ("math"):
        command = this.generateStatement(mathStmt); 
        runRandomCommand(command);
        break;
      case ("boolean"):
        command = this.generateStatement(booleanStmt); 
        runRandomCommand(command);
        break;
      case ("if"):
        command = this.generateStatement(ifStmt); 
        runRandomCommand(command);
        break;
      case ("random"):
        this.randomType(); 
        break;
    } 
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

    if (!this.isAppended) {
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this.isAppended = true;
    }

    this.terminal.initTerminal();
    this.renderRadio();

    const resetBtn = document.querySelector("#demo__button-reset");
    resetBtn.addEventListener("click", () => { this.terminal.resetTerminal() });
    const randomBtn = document.querySelector("#demo__button-random");
    randomBtn.addEventListener("click", () => { this.randomStatement(app.statements.type) });
  }
}

customElements.define("demo-page", Demo);
