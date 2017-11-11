export class EmployeesController {
  constructor() {

  }

  index(req, res) {
    res.render('employees', { css: ['main.css'] });
  }
}
