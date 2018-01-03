const
  Path = require('path'),
  commandsPath = Path.resolve(__dirname, "commands"),
  listenersPath = Path.resolve(__dirname, "listeners");

module.exports = robot => {
  robot.load(commandsPath);
  robot.load(listenersPath);
};
