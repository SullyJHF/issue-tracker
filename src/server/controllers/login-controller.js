import { UserModel } from '../models/user-model';

export class LoginController {
  constructor() {}

  index(req, res) {
    console.log(req.body);
    res.render('login', {
      title: 'Login',
      css: ['main.css'],
      errors: req.body.errors,
      formData: { email: req.body.email }
    });
  }

  async login(req, res) {
    // do login authentication
    let email = req.body.email;
    let password = req.body.password;

    let exists = await UserModel.checkExists(email);

    if (!exists) {
      // user not found in database
      req.body.errors = {
        email: 'Email address not found'
      };
      res.statusCode = 404;
      this.index(req, res);
      return;
    }

    console.log(req.body);
    res.redirect('/issues');
  }
}
