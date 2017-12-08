export class LogoutController {
  constructor() {

  }

  logout(req, res) {
    res.clearCookie('token');
    req.user = undefined;
    res.redirect('/');
  }
}
