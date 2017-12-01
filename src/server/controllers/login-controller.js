import { UserModel } from '../models/user-model';

export class LoginController {
  constructor() {}

  index(req, res) {
    console.log(req.body.errors, req.body.formData);
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

    let data = await UserModel.validate(email, password);

    if (data.error) {
      req.body.errors = data.errors;
      req.body.formData = data.formData;
      res.statusCode = data.errors.statusCode;
      this.index(req, res);
      return;
    }
    
    res.redirect('/issues');
  }
}
