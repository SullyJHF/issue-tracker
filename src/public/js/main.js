import { Modal } from './modal';
import { SimpleButton } from './simple-button';
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


// All pages
let logoutBtn = new SimpleButton('logout-btn', (event) => {
  window.location = '/logout';
});
