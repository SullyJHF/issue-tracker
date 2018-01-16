export default {
  db: {
    users: [{
      EMP_ID: 1,
      EMAIL: 'test@test.com',
      HASHED_PASS: '$2b$10$9hHxPjvI0ApGB1NmO8vgbONhADFdtfLGMZTDo2OZvqas4z4AYSv2O',
      FIRST_NAME: 'Jim',
      SURNAME: 'Way',
      CAPACITY: 5,
      TEAM_ID: 2,
      TIER: 'Apprentice',
      ROLE: 0
    }],

    issues: [{
      ISSUE_ID: 'ISSUE-1',
      TITLE: 'Test Issue',
      DESCRIPTION: 'Test Description',
      ESTIMATED_TIME: '7200',
      EMP_ID: 1,
      STATE: 'In Progress',
      TOTAL_SECONDS_LOGGED: '3900'
    }],

    updatedIssues: [{
      ISSUE_ID: 'ISSUE-1',
      TITLE: 'Test Issue',
      DESCRIPTION: 'Test Description',
      ESTIMATED_TIME: '7200',
      EMP_ID: 1,
      STATE: 'Closed',
      TOTAL_SECONDS_LOGGED: '3900'
    }],

    teams: [{
      TEAM_ID: 2,
      TEAM_NAME: 'Product',
      SCHEME_ID: 3
    }],

    colourSchemes: [{
      SCHEME_ID: 3,
      NAME: 'Purple Shades',
      RESOLVE_COLOUR: '#A33EAA',
      CLOSE_COLOUR: '#DE57E2',
      IN_PROGRESS_COLOUR: '#BC005E',
      AWAITING_START_COLOUR: '#650E37',
      DEFAULT_COLOUR: '#A33EAA'
    }],

    tiers: [{
      TIER: 'Apprentice',
      COST: 100
    }, {
      TIER: 'Developer',
      cost: 175
    }],

    workLogs: [{
      SPRINT_ID: 1,
      ISSUE_ID:'ISSUE-1',
      SECONDS_LOGGED: 900
    }, {
      SPRINT_ID: 1,
      ISSUE_ID:'ISSUE-1',
      SECONDS_LOGGED: 1000
    }, {
      SPRINT_ID: 2,
      ISSUE_ID:'ISSUE-1',
      SECONDS_LOGGED: 250
    }, {
      SPRINT_ID: 1,
      ISSUE_ID:'ISSUE-1',
      SECONDS_LOGGED: 750
    }]
  },

  models: {
    issues: [{
      id: 'ISSUE-1',
      title: 'Test Issue',
      description: 'Test Description',
      estimate: '7200',
      friendlyEstimate: '2h',
      assignee: {
        id: 1,
        email: 'test@test.com',
        hashedPass: '$2b$10$9hHxPjvI0ApGB1NmO8vgbONhADFdtfLGMZTDo2OZvqas4z4AYSv2O',
        firstName: 'Jim',
        surname: 'Way',
        fullName: 'Jim Way',
        capacity: 5,
        team: {
          id: 2,
          name: 'Product',
          colourScheme: {
            id: 3,
            title: 'Purple Shades',
            resolve: '#A33EAA',
            close: '#DE57E2',
            inProgress: '#BC005E',
            awaitingStart: '#650E37',
            defaultColour: '#A33EAA'
          }
        },
        tier: {
          name: 'Apprentice',
          cost: 100
        },
        role: 0
      },
    state: 'In Progress',
    totalSeconds: 3900,
    friendlyTotal: '1h 5m',
    workLogs: [{
        sprint: 1,
        issue: 'ISSUE-1',
        time: 900,
        friendlyTime: '15m'
      }, {
        sprint: 1,
        issue: 'ISSUE-1',
        time: 1000,
        friendlyTime: '16m 40s'
      }, {
        sprint: 2,
        issue: 'ISSUE-1',
        time: 250,
        friendlyTime: '4m 10s'
      }, {
        sprint: 1,
        issue: 'ISSUE-1',
        time: 750,
        friendlyTime: '12m 30s'
      }]
    }]
  },
  userModel: {
    id: 1,
    email: 'test@test.com',
    hashedPass: '$2b$10$9hHxPjvI0ApGB1NmO8vgbONhADFdtfLGMZTDo2OZvqas4z4AYSv2O',
    firstName: 'Jim',
    surname: 'Way',
    fullName: 'Jim Way',
    capacity: 5,
    tier: 'Apprentice',
    role: 0,
    team: {
      id: 2,
      name: 'Product',
      colourScheme: {
        id: 3,
        title: 'Purple Shades',
        resolve: '#A33EAA',
        close: '#DE57E2',
        inProgress: '#BC005E',
        awaitingStart: '#650E37',
        defaultColour: '#A33EAA'
      }
    },
    tier: {
      name: 'Developer',
      cost: 175
    },
  },
  teamModel: {
    id: 2,
    name: 'Product',
    colourScheme: {
      id: 3,
      title: 'Purple Shades',
      resolve: '#A33EAA',
      close: '#DE57E2',
      inProgress: '#BC005E',
      awaitingStart: '#650E37',
      defaultColour: '#A33EAA'
    }
  },
  colourSchemeModel: {
    id: 3,
    title: 'Purple Shades',
    resolve: '#A33EAA',
    close: '#DE57E2',
    inProgress: '#BC005E',
    awaitingStart: '#650E37',
    defaultColour: '#A33EAA'
  },
  tierModel: {
    name: 'Developer',
    cost: 175
  }
}
