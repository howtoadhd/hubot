const
  GitHubApi = require('github'),
  oauth = require("oauth").OAuth2,

  encryption = require('./encryption'),

  OAuth2 = new oauth(
    process.env.HUBOT_GITHUB_CLIENT_ID,
    process.env.HUBOT_GITHUB_CLIENT_SECRET,
    "https://github.com/",
    "login/oauth/authorize",
    "login/oauth/access_token"
  );

module.exports = robot => {

  robot.router.get('/auth/github', (req, res) => {

    if (!req.query.id) {
      res.send('I dont know who you are!');
      return;
    }

    user = robot.brain.userForId(req.query.id);

    if (user.github && user.github.username) {
      res.send('A GitHub account is already linked to this Discord user.');
      return;
    }

    res.writeHead(303, {
      Location: OAuth2.getAuthorizeUrl({
        redirect_uri: `${process.env.HUBOT_HOSTNAME}/auth/github/callback?id=${req.query.id}`,
        scope: "read:user,public_repo"
      })
    });

    res.end();
  });

  robot.router.get('/auth/github/callback', (req, res) => {

    if (!req.query.id || !req.query.code) {
      res.send('I dont know who you are!');
      return;
    }

    OAuth2.getOAuthAccessToken(req.query.code, {}, (err, access_token, refresh_token) => {
      if (err) {
        res.send('An error occurred, please try again later.');
        return;
      }

      github = new GitHubApi();

      github.authenticate({
        type: 'token',
        token: access_token
      });

      github.users.get({}, (err, profile) => {
        if (err) {
          res.send('An error occurred, please try again later.');
          return;
        }

        user = robot.brain.userForId(req.query.id);
        user.github = {
          username: profile.data.login,
          token: encryption.encrypt(access_token),
        };

        robot.brain.save();

        robot.messageRoom(process.env.HUBOT_DISCORD_ROOM_ID, `<@${req.query.id}> is \`${profile.data.login}\` on GitHub.`);
        res.send('You may now close the window.');
      });
    });
  });
};
