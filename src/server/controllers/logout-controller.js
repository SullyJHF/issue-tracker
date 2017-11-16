export class LogoutController {
  constructor() {

  }

  logout(req, res) {
    // do login authentication
    res.redirect('/');
  }
}
