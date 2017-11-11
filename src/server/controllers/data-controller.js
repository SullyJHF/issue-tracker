export class DataController {
  constructor() {

  }

  index(req, res) {
    res.render('data', { css: ['main.css'] })
  }
}
