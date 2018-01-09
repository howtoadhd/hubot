const
  api = require('./api'),
  commands = require('./commands'),
  routes = require('./routes');

module.exports = (robot) => {

  robot.github = api;
  commands(robot);
  routes(robot);
};
