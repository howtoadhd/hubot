const
  GitHubApi = require('github'),

  encryption = require('./encryption'),

  client_id = process.env.HUBOT_GITHUB_CLIENT_ID,
  client_secret = process.env.HUBOT_GITHUB_CLIENT_SECRET;

const api = () => {
  const github = new GitHubApi;

  github.authenticate({
    type: 'oauth',
    key: client_id,
    secret: client_secret,
  });

  return github
};

api.user = (id) => {
  const github = new GitHubApi;

  const user = robot.brain.userForId(id);

  if (!user.github || !user.github.username) {
    throw new Error(`User account ${id} not linked to GitHub.`, 'github-not-linked');
  }

  github.authenticate({
    type: 'token',
    token: encryption.decrypt(user.github.token),
  });

  return github
};

module.exports = api;
