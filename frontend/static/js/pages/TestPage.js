import Terminal from "../services/initTerminal.js";
import { randomExp, mathExp, booleanExp, ifExp, letExp, functionExp, lenExp, arrayExp } from "../data/expressions.js";
import expressions from '../services/expressiontype.js';

export default class TestPage extends HTMLElement {
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
        value: "random",
        display: "Random",
      },
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
      }
    ]
    const form = document.querySelector("#test__form");
    types.forEach((type) => {
      const span = document.createElement("span");
      const i = document.createElement("input");
      i.type = "radio";
      i.className = "test__types-input";
      i.name = "types";
      i.value = type.value;
      i.id = type.value;
      i.title = "Statement type radio input " + type.value;
      i.alt = "Statement type radio input " + type.value;

      if (app.expressiontype && app.expressiontype.type === type.value) {
        i.checked = true;
      }

      const l = document.createElement("label");
      l.htmlFor = type.value;
      l.className = "test__types-label";
      l.id = `${type.value}-label`;
      l.innerText = type.display;
      l.title = "Statement type radio label " + type.value;
      l.alt = "Statement type radio label " + type.value;
      
      span.appendChild(i);
      span.appendChild(l);
      form.appendChild(span);
      l.addEventListener("click", (event) => {
        app.statementType = type.value;
      });
      i.addEventListener("click", (event) => {
        app.statementType = type.value;
      });
    });
  }


  randomStatement(type) {
    let command;
    const { terminal } = this;
    switch (type) {
      case ("let"):
        command = this.generateStatement(letExp); 
        terminal.runRandomCommand(command);
        break; 
      case ("function"):
        command = this.generateStatement(functionExp); 
        terminal.runRandomCommand(command);
        break;
      case ("len"):
        command = this.generateStatement(lenExp); 
        terminal.runRandomCommand(command);
        break;
      case ("array"):
        command = this.generateStatement(arrayExp); 
        terminal.runRandomCommand(command);
        break;
      case ("math"):
        command = this.generateStatement(mathExp); 
        terminal.runRandomCommand(command);
        break;
      case ("boolean"):
        command = this.generateStatement(booleanExp); 
        terminal.runRandomCommand(command);
        break;
      case ("if"):
        command = this.generateStatement(ifExp); 
        terminal.runRandomCommand(command);
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
    const random = Math.floor(Math.random() * (randomExp.length - 1));
    const selected = randomExp[random];
    this.randomStatement(selected);
  }

  render() {
    const template = document.getElementById("test-page-template");

    if (!this.isAppended) {
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this.isAppended = true;
    }

    this.terminal.initTerminal();
    this.renderRadio();

    const resetBtn = document.querySelector("#test__button-reset");
    resetBtn.addEventListener("click", () => { this.terminal.resetTerminal() });
    const randomBtn = document.querySelector("#test__button-random");
    randomBtn.addEventListener("click", () => { this.randomStatement(app.statementType) });
  }
}

customElements.define("test-page", TestPage);
