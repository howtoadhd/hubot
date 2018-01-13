const
  api = require('./api'),
  commands = require('./commands'),
  routes = require('./routes');

module.exports = (robot) => {

  robot.travis = api(robot);
  commands(robot);
  routes(robot);
};
