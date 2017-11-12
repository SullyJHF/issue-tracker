import { Modal } from './modal';

let createIssueBtn = document.getElementById('create-issue');
let issueCreateModal = new Modal('issue-create-modal');

if (createIssueBtn) {
  createIssueBtn.addEventListener('click', (e) => {
    issueCreateModal.show();
  });
}
