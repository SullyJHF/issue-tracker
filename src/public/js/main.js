import { Modal } from './modal';
import { SimpleButton } from './simple-button';

let issueCreateModal = new Modal('issue-create-modal');

let createIssueBtn = new SimpleButton('create-issue', (event) => {
  issueCreateModal.show();
});

let logoutBtn = new SimpleButton('logout-btn', (event) => {
  window.location = '/logout';
});
