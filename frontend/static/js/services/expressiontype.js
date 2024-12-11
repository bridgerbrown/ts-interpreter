const expressiontype = {
  type: "",
};

const pExpressionType = new Proxy(expressiontype, {
  set(target, property, value){
    target[property] = value;
    if (property == "expression") {
      window.dispatchEvent(new Event("expressiontypechange"))
    }
    return true;
  },
  get(target, property) {
    return target[property];
  }
}) 

export default pExpressionType;
