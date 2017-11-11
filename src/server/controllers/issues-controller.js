export class IssuesController {
  constructor() {

  }

  home(req, res) {
    res.render('issues', { css: ['main.css'] });
  }
}
