module.exports = (robot) => {

  robot.respond(/github link$/i, msg => {

    user = robot.brain.userForId(msg.envelope.user.id);

    if (user.github && user.github.username) {
      msg.reply(`You are already connected to GitHub as ${user.github.username}`);
      return;
    }

    msg.reply("I have sent you a DM with your GitHub auth link.");
    robot.messageRoom(msg.envelope.user.id, `Please link your GitHub account here: ${process.env.HUBOT_HOSTNAME}/auth/github?id=${msg.envelope.user.id}`);
  });

  robot.respond(/github unlink$/i, msg => {

    user = robot.brain.userForId(msg.envelope.user.id);

    if (!user.github || !user.github.username) {
      msg.reply(`You are not connected to GitHub so there is nothing i can do here.`);
      return;
    }

    delete user.github;

    robot.brain.save();

    msg.reply("Your GitHub account has been disconnected.");
  });
};
