export class IssuesController {
  constructor() {

  }

  index(req, res) {
    res.render('issues', { css: ['main.css'] });
  }

  create(req, res) {
    // do logic and add to database
    // res.redirect('/issues/:issueId');
  }
}
