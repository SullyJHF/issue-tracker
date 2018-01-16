export class TestDb {
  constructor(queryFunc, formatFunc) {
    this.query = queryFunc;
    this.format = formatFunc;
  }
}
