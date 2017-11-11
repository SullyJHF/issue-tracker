export class LoginController {
  constructor() {

  }

  login(req, res) {
    // do login authentication
    console.log(req.body);
    res.redirect('/issues');
  }
}
