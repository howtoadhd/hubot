const
  Travis = require('travis-ci'),

  encryption = require('hubot-github-auth/src/encryption');

module.exports = (robot) => {

  const api = () => {
    return new Travis({
      version: '2.0.0',
      headers: {
        'user-agent': 'Travis/1.0',
      },
    });
  };

  api.user = (id, cb) => {
    const travis = new Travis({
      version: '2.0.0',
      headers: {
        'user-agent': 'Travis/1.0',
      },
    });

    const user = robot.brain.userForId(id);

    if (!user.github || !user.github.username) {
      return cb("You are not linked to GitHub.", null);
    }

    travis.authenticate({
      github_token: encryption.decrypt(user.github.token),
    }, (err) => {
      if (err) {
        return cb(new Error( err, 'travis-error'), null);
      }
      cb(null, travis)
    });
  };

  return api
};
