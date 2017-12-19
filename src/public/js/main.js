import { Modal } from './modal';
import { SimpleButton } from './simple-button';
import { ValidatedForm } from './validated-form';
import './lib/jscolor.min.js';


// Issue page
let issueCreateModal = new Modal('issue-create-modal');

let createIssueBtn = new SimpleButton('create-issue', (event) => {
  issueCreateModal.show();
});


// Data page
let colourSchemeCreateModal = new Modal('colour-scheme-create-modal');

let colourSchemeCreateBtn = new SimpleButton('create-colour-scheme', (event) => {
  colourSchemeCreateModal.show();
});


// Employees page
let employeeCreateModal = new Modal('employee-create-modal');

let employeeCreateBtn = new SimpleButton('create-employee', (event) => {
  employeeCreateModal.show();
});


// Issue page
let logTimeModal = new Modal('log-time-modal');

let logTimeBtn = new SimpleButton('log-time-btn', (event) => {
  logTimeModal.show();
})

let editLogTimeModal = new Modal('edit-time-modal');

let workLogButtons = document.getElementsByClassName('edit-work-log-btn');

let editLogTimeBtns = SimpleButton.createAll(workLogButtons, function(event) {
  editLogTimeModal.elm.querySelector('input[name=editLogSprint]').value = this.dataset.sprint;
  editLogTimeModal.elm.querySelector('input[name=editLogOldTime]').value = this.dataset.time;
  editLogTimeModal.elm.querySelector('input[name=editLogTime]').value = this.dataset.friendlyTime;
  editLogTimeModal.show();
});


// All pages
let logoutBtn = new SimpleButton('logout-btn', (event) => {
  window.location = '/logout';
});


// Login page
// formData and errors comes from the ejs
let loginForm = new ValidatedForm('login-form', formData, errors);
