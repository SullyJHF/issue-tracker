import { UserModel } from '../models/user-model';
import { TokenModel } from '../models/token-model';

export class LoginController {
  constructor(db) {
    this.db = db;
    this.login = this.login.bind(this);
  }

  index(req, res) {
    if (req.cookies.token) {
      res.redirect('/issues');
      return;
    }

    res.render('login', {
      title: 'Login',
      css: ['main.css'],
      errors: req.body.errors,
      formData: req.body.formData
    });
  }

  async login(req, res) {
    // do login authentication
    let email = req.body.email;
    let password = req.body.password;

    let data = await UserModel.validate(this.db, email, password);

    if (data.error) {
      req.body.errors = data.errors;
      req.body.formData = data.formData;
      res.statusCode = data.errors.statusCode;
      this.index(req, res);
      return;
    }

    // if function gets to this point then data is a user object
    let user = data;
    
    let token = TokenModel.generateTokenForUser(user);

    res.cookie('token', token);

    res.redirect(req.session.prevUrl || '/issues');
  }
}
