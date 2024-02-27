const statements = {
  type: "random",
};

const pStatements = new Proxy(statements, {
  set(target, property, value){
    target[property] = value;
    if (property == "statement") {
      window.dispatchEvent(new Event("statementchange"))
    }
    return true;
  },
  get(target, property) {
    return target[property];
  }
}) 

export default pStatements;
