const
  commands = require('./commands'),
  routes = require('./routes');

module.exports = (robot) => {

  commands(robot);
  routes(robot);
};
