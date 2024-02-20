export default class Home {
  constructor(params) {
    this.params = params;
  }

  async getHtml() {
    return "<h1>test</h1>";
  }
}
