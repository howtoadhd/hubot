module.exports = (robot) => {

  robot.respond(/rebuild ([a-z0-9._-]+)$/i, msg => {

    const repo = {"owner": 'howtoadhd', "repo": msg.match[1]};

    robot.github().repos.get(repo, (err, ghResponse) => {
      if (err) {
        msg.reply(`Repository \`${process.env.HUBOT_GITHUB_ORG}/${msg.match[1]}\` does not exist.`);
        return;
      }

      const ghRepo = ghResponse.data;

      robot.travis().repos('howtoadhd', msg.match[1]).get((err, ciResponse) => {
        if (err) {
          return;
        }

        const ciRepo = ciResponse.repo;

        if (!ciRepo.active) {
          msg.reply(`Repository \`${process.env.HUBOT_GITHUB_ORG}/${msg.match[1]}\` is inactive.`);
          return;
        }

        robot.travis().repos('howtoadhd', msg.match[1]).branches(ghRepo.default_branch).get((err, ciResponse) => {
          if (err) {
            return;
          }
          const ciBranch = ciResponse.branch;

          robot.travis.user(msg.envelope.user.id, (err, travis) => {
            if (err) {
              msg.reply(err);
              return;
            }

            travis.builds(ciBranch.id).restart.post((err, ciBranch) => {
              if (err) {
                return;
              }

              if (!ciBranch.result) {
                msg.reply(ciBranch.flash[0].error)
              }

              msg.reply('I have spoken to Travis and said he will get right on that.')
            });
          });
        });
      });
    });
  });
};
