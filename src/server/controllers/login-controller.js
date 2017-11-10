export class LoginController {
  constructor() {

  }

  login(req, res) {
    console.log(req.body);
    res.json({success: true});
  }
}
