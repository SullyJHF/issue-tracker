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

  issue(req, res) {
    let id = req.params.id;
    
    res.redirect('/issues');
  }

  create(req, res) {
    // do logic and add to database
    console.log(req.body);
    let id = req.body.project + '-1';

    res.redirect(`/issues/${id}`);
  }
}
