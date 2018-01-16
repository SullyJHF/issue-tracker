import 'babel-polyfill';
import test from 'tape';

import mysql from 'promise-mysql';

import { TestDb } from './db';
import values from './values';

import { IssueModel } from '../src/server/models/issue-model';
import { UserModel } from '../src/server/models/user-model';
import { WorkLogModel } from '../src/server/models/work-log-model';


test('IssueModel createFromDb', subTest => {
  let db = new TestDb(
    (sql) => {
      subTest.equal(typeof sql, 'string', 'SQL should be a string');
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
      }
    },
    (sql, inserts) => {
      subTest.equal(typeof sql, 'string', 'SQL should be a string');
      subTest.ok(inserts instanceof Array, 'Inserts should be an array');
      return mysql.format(sql, inserts);
    }
  );

  subTest.test(' > happy path', async t => {
    t.plan(1);

    try {
      let issue = await IssueModel.createFromDb(db, values.db.issues[0]);
      t.deepEqual(issue, values.models.issues[0], '> Issue should be a valid issue');
    } catch (e) {
      t.fail('Error should not be thrown');
    }
  });

  subTest.test(' > invalid db issue', async t => {
    t.plan(1);

    try {
      let issue = await IssueModel.createFromDb(db, null);
      t.fail('Error should have been thrown');
    } catch (e) {
      t.deepEqual(e, new Error('dbIssue must be a valid issue from the database'), 'Error should be thrown');
    }
  });
});
