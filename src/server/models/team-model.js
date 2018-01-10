import { ColourSchemeModel } from './colour-scheme-model';
import { UserModel } from './user-model';
import { SprintModel } from './sprint-model';
import { WorkLogModel } from './work-log-model';
import { IssueState } from '../utils/issue-state';
import db from '../database';

export class TeamModel {
  constructor(id, name, colourScheme) {
    this.id = id;
    this.name = name;
    this.colourScheme = colourScheme;
  }

  // change colourScheme to colourSchemeId
  static async createFromReq({teamName, teamColourScheme}) {
    let colourSchemeObj = await ColourSchemeModel.getById(teamColourScheme);
    return new TeamModel(-1, teamName, colourSchemeObj);
  }

  static createFromDb(teamData) {
    return new TeamModel(
      teamData.TEAM_ID,
      teamData.TEAM_NAME,
      ColourSchemeModel.createFromDb(teamData)
    );
  }

  static async insert(team) {
    if (!(team instanceof TeamModel)) throw new Error('Data must be of type TeamModel');
    let sql = 'INSERT INTO teams VALUES (NULL, ?, ?)';
    let inserts = [
      team.name,
      team.colourScheme.id
    ];
    
    sql = db.format(sql, inserts);

    let result = await db.query(sql);

    // if there're no errors do this
    team.id = result.insertId;

    return result;
  }

  static async getById(id) {
    let query = db.format(
      'SELECT * FROM teams WHERE TEAM_ID=?',
      [id]
    );
    let results = await db.query(query);
    return this.createFromDb(results[0]);
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM teams, colour_schemes WHERE teams.SCHEME_ID = colour_schemes.SCHEME_ID');
    return results.map(this.createFromDb);
  }

  static async getEstimatedChartData(teamId) {
    let teamUsers = await UserModel.getByTeamId(teamId);
    if (!teamUsers.length) return;
    let teamColours = await ColourSchemeModel.getByEmpId(teamUsers[0].id);
    teamUsers = teamUsers.map((user) => {
      return {id: user.id, fullName: user.fullName}
    });

    let totalEstimates = await TeamModel.getTotalEstimates(teamId);

    let datasets = [];

    for (let key in IssueState) {
      let state = IssueState[key];
      let data = [];
      for (let user of teamUsers) {
        let temp = totalEstimates.find((obj) => user.id === obj.id && state === obj.state);
        let estimate = temp && temp.estimatedTime || 0;
        data.push(estimate);
      }
      let dataset = {
        label: state,
        backgroundColor: teamColours[state],
        data
      }
      datasets.push(dataset);
    }

    let chartData = {
      team: teamId,
      type: 'bar',
      data: {
        labels: teamUsers.map((user) => user.fullName),
        datasets
      }
    };

    return chartData;
  }

  static async getTimeLoggedChartData(teamId) {
    let teamUsers = await UserModel.getByTeamId(teamId);
    if (!teamUsers.length) return;
    let teamColours = await ColourSchemeModel.getByEmpId(teamUsers[0].id);
    teamUsers = teamUsers.map((user) => {
      return {id: user.id, fullName: user.fullName}
    });

    let totalLoggedTime = await TeamModel.getTotalTimeLogged(teamId);

    let datasets = [];

    for (let key in IssueState) {
      let state = IssueState[key];
      let data = [];
      for (let user of teamUsers) {
        let temp = totalLoggedTime.find((obj) => user.id === obj.id && state === obj.state);
        let timeLogged = temp && temp.timeLogged || 0;
        data.push(timeLogged);
      }
      let dataset = {
        label: state,
        backgroundColor: teamColours[state],
        data
      }
      datasets.push(dataset);
    }

    let chartData = {
      team: teamId,
      type: 'bar',
      data: {
        labels: teamUsers.map((user) => user.fullName),
        datasets
      }
    };

    return chartData;
  }

  static async getTotalTimeLogged(teamId) {
    let query = 'SELECT users.EMP_ID, users.FIRST_NAME, users.SURNAME, SUM(issues.TOTAL_SECONDS_LOGGED) AS TOTAL_SECONDS_LOGGED, issues.STATE ' +
    'FROM users ' +
      'INNER JOIN issues ' +
        'ON users.EMP_ID = issues.EMP_ID '+
    'WHERE users.TEAM_ID = ? '+
    'GROUP BY STATE, users.EMP_ID';

    let inserts = [teamId];
    query = db.format(query, inserts);
    let results = await db.query(query);
    return results.map((userTimeLogged) => {
      return {
        id: userTimeLogged.EMP_ID,
        state: userTimeLogged.STATE,
        timeLogged: userTimeLogged.TOTAL_SECONDS_LOGGED,
        fullName: userTimeLogged.FIRST_NAME + ' ' + userTimeLogged.SURNAME
      };
    });
  }

  static async getTotalEstimates(teamId) {
    let query = 'SELECT users.EMP_ID, users.FIRST_NAME, users.SURNAME, SUM(issues.ESTIMATED_TIME) AS TOTAL_ESTIMATED_TIME, issues.STATE ' +
    'FROM users ' +
      'INNER JOIN issues ' +
        'ON users.EMP_ID = issues.EMP_ID '+
    'WHERE users.TEAM_ID = ? '+
    'GROUP BY STATE, users.EMP_ID';

    let inserts = [teamId];
    query = db.format(query, inserts);
    let results = await db.query(query);
    return results.map((userEstimate) => {
      return {
        id: userEstimate.EMP_ID,
        state: userEstimate.STATE,
        estimatedTime: userEstimate.TOTAL_ESTIMATED_TIME,
        fullName: userEstimate.FIRST_NAME + ' ' + userEstimate.SURNAME
      };
    });
  }
}
