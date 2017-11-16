export class IssuesController {
  constructor() {

  }

  index(req, res) {
    let data = {
      currentUser: {
        fullName: 'Sullivan Ford'
      }
    };

    res.render('issues', Object.assign({ css: ['main.css'] }, data));
  }

  create(req, res) {
    // do logic and add to database
    // res.redirect('/issues/:issueId');
  }
}
