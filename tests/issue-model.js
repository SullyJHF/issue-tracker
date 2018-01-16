import 'babel-polyfill';
import test from 'tape';

import mysql from 'promise-mysql';

import { TestDb } from './db';
import values from './values';

import { IssueModel } from '../src/server/models/issue-model';
import { UserModel } from '../src/server/models/user-model';
import { WorkLogModel } from '../src/server/models/work-log-model';

let db = new TestDb(
  function (sql) {
    this.test.equal(typeof sql, 'string', 'SQL should be a string');
    switch(sql) {
      case 'SELECT * FROM users WHERE EMP_ID = 1':
        return [values.db.users[0]];
      case 'SELECT * FROM teams WHERE TEAM_ID=2':
        return [values.db.teams[0]];
      case 'SELECT * FROM colour_schemes WHERE SCHEME_ID=3':
        return [values.db.colourSchemes[0]];
      case 'SELECT * FROM tiers WHERE TIER=\'Apprentice\'':
        return [values.db.tiers[0]];
      case 'SELECT * FROM work_log WHERE ISSUE_ID=\'ISSUE-1\'':
        return values.db.workLogs;
      case 'SELECT * FROM issues WHERE ISSUE_ID = \'ISSUE-1\'':
        return [values.db.issues[0]];
      case 'UPDATE issues SET TITLE=\'Test Issue\', DESCRIPTION=\'Test Description\', STATE=\'Closed\', TOTAL_SECONDS_LOGGED=3900, ESTIMATED_TIME=\'7200\', EMP_ID=1 WHERE ISSUE_ID=\'ISSUE-1\'':
        return values.db.updatedIssues[0];
      case 'SELECT * FROM issues':
        return values.db.issues;
      default:
       return [];
    }
  },
  function (sql, inserts) {
    this.test.equal(typeof sql, 'string', 'SQL should be a string');
    this.test.ok(inserts instanceof Array, 'Inserts should be an array');
    return mysql.format(sql, inserts);
  }
);

test('IssueModel.createFromDb', subTest => {
  db.test = subTest;

  subTest.test('> Happy path', async t => {
    t.plan(1);

    try {
      let issue = await IssueModel.createFromDb(db, values.db.issues[0]);
      t.deepEqual(issue, values.models.issues[0], '> Issue should be a valid issue');
    } catch (e) {
      t.fail('Error should not be thrown');
    }
  });

  subTest.test('> Invalid db issue', async t => {
    t.plan(1);

    try {
      let issue = await IssueModel.createFromDb(db, null);
      t.fail('Error should have been thrown');
    } catch (e) {
      t.deepEqual(e, new Error('dbIssue must be a valid issue from the database'), 'Error should be thrown');
    }
  });
});

test('IssueModel.updateIssue', subTest => {
  db.test = subTest;

  subTest.test('> Happy path', async t => {
    let validIssue = values.models.issues[0];
    let updatedIssue = Object.assign({}, validIssue);
    updatedIssue.state = 'Closed';

    t.plan(2);

    let issue;

    try {
      issue = await IssueModel.createFromDb(db, values.db.issues[0]);
      t.deepEqual(issue, validIssue, '> Issue should be a valid issue');

      issue.state = 'Closed';

      issue = await IssueModel.updateIssue(db, issue);
      issue = await IssueModel.createFromDb(db, issue);
      t.deepEqual(issue, updatedIssue, '> Issue should update correctly');
    } catch (e) {
      t.fail('Error should not be thrown');
    }
  });

  subTest.test('> Invalid updated issue', async t => {
    t.plan(1);

    try {
      let issue = await IssueModel.updateIssue(db, null);
    } catch (e) {
      t.deepEqual(e, new Error('Data must be of type IssueModel'), 'Error should be thrown');
    }
  });
});

test('IssueModel.getById', subTest => {
  db.test = subTest;

  subTest.test('> Happy path', async t => {
    t.plan(1);
    let issue = await IssueModel.getById(db, 'ISSUE-1');
    t.deepEqual(issue, values.models.issues[0], '> Issue should be valid');
  });

  subTest.test('> No issues found', async t => {
    t.plan(1);
    let issue = await IssueModel.getById(db, 'ISSUE-2');
    t.equal(issue, null, '> Issue should be null');
  })
});


test('IssueModel.getAll', subTest => {
  db.test = subTest;

  subTest.test('> Happy path', async t => {
    t.plan(1);
    let issue = await IssueModel.getAll(db);
    t.deepEqual(issue, values.models.issues, '> Correct issues should be returned');
  })
})
