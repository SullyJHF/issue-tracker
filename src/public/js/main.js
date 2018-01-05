import { Modal } from './modal';
import { SimpleButton } from './simple-button';
import { ValidatedForm } from './validated-form';
import { chartOptions } from './chart-options';
import './lib/jscolor.min.js';

import fuzzy from 'fuzzy';
import Chart from 'chart.js';


// Issue page
const issueCreateModal = new Modal('issue-create-modal');

const createIssueBtn = new SimpleButton('create-issue', (event) => {
  issueCreateModal.show();
});


// Data page
const colourSchemeCreateModal = new Modal('colour-scheme-create-modal');

const colourSchemeCreateBtn = new SimpleButton('create-colour-scheme', (event) => {
  colourSchemeCreateModal.show();
});

const estimatedChartCanvas = document.getElementById('estimated-data-chart');
const timeLoggedChartCanvas = document.getElementById('time-logged-data-chart');

if (estimatedChartCanvas) {
  let ctx = estimatedChartCanvas.getContext('2d');
  new Chart(ctx, Object.assign(estimatedData, chartOptions));
}

if (timeLoggedChartCanvas) {
  let ctx = timeLoggedChartCanvas.getContext('2d');
  new Chart(ctx, Object.assign(timeLoggedData, chartOptions));
}


// Employees page
let employeeCreateModal = new Modal('employee-create-modal');
let employeeEditModal = new Modal('employee-edit-modal');

let employeeCreateBtn = new SimpleButton('create-employee', (event) => {
  employeeCreateModal.show();
});

let employeeEditBtns = SimpleButton.createAll(document.getElementsByClassName('employee'), function(event) {
  employeeEditModal.clearValues();
  employeeEditModal.fillValues(this.dataset);
  employeeEditModal.show();
});


// Issue page
let logTimeModal = new Modal('log-time-modal');

let logTimeBtn = new SimpleButton('log-time-btn', (event) => {
  logTimeModal.show();
  logTimeModal.elm.querySelector('#time').focus();
});

let editLogTimeModal = new Modal('edit-time-modal');

let workLogButtons = document.getElementsByClassName('edit-work-log-btn');

let editLogTimeBtns = SimpleButton.createAll(workLogButtons, function(event) {
  editLogTimeModal.elm.querySelector('input[name=editLogSprint]').value = this.dataset.sprint;
  editLogTimeModal.elm.querySelector('input[name=editLogOldTime]').value = this.dataset.time;
  editLogTimeModal.elm.querySelector('input[name=editLogTime]').value = this.dataset.friendlyTime;
  editLogTimeModal.show();
});

let filterInput = document.getElementById('filter-issues');
if (filterInput) {
  ['change', 'keydown', 'keyup'].forEach((eventCode) => {
    filterInput.addEventListener(eventCode, (event) => {
      let issues = Array.from(document.getElementsByClassName('issue'));
      let issueTexts = issues.map((elm) => elm.querySelector('.issueTitle').innerHTML);
      let options = {
        extract: (elm) => elm.querySelector('.issueId').innerHTML + elm.querySelector('.issueTitle').innerHTML + elm.querySelector('.issueAssignee').innerHTML
      }
      let filteredIssues = fuzzy.filter(filterInput.value, issues, options).map((fuzzyObj) => fuzzyObj.original);
      for (let issue of issues) {
        if (filteredIssues.includes(issue)) {
          issue.style.display = 'block';
        } else {
          issue.style.display = 'none';
        }
      }
    });
  });
}

let deleteIssueModal = new Modal('delete-issue-modal');

let deleteIssueButton = new SimpleButton('delete-btn', (event) => {
  deleteIssueModal.show();
});


// All pages
let logoutBtn = new SimpleButton('logout-btn', (event) => {
  window.location = '/logout';
});


// Login page
// formData and errors comes from the ejs
let loginForm = new ValidatedForm('login-form', formData, errors);
