export class IssuesController {
  constructor() {

  }

  index(req, res) {
    res.render('issues', { css: ['main.css'] });
  }
}
