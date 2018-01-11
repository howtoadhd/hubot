const
  api = require('./api'),
  commands = require('./commands');

module.exports = (robot) => {

  robot.travis = api(robot);
  commands(robot);
};
