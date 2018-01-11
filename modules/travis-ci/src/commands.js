module.exports = (robot) => {

  robot.respond(/rebuild ([a-z0-9._-]+) ?(\S+)?$/i, msg => {

    const repo = {
      "owner": process.env.HUBOT_GITHUB_ORG,
      "repo": msg.match[1],
      "branch": msg.match[2],
    };

    robot.github().repos.get(repo, (err, ghResponse) => {
      if (err) {
        msg.reply(`Repository \`${repo.owner}/${repo.repo}\` does not exist.`);
        return;
      }

      const ghRepo = ghResponse.data;

      if (!repo.branch) {
        repo['branch'] = ghRepo.default_branch;
      }

      robot.github().repos.getBranch(repo, (err, ghBranch) => {
        if (err) {
          msg.reply(`Branch \`${repo.owner}/${repo.repo}#${repo.branch}\` does not exist.`);
          return;
        }

        robot.travis().repos(repo.owner, repo.repo).get((err, ciResponse) => {
          if (err) {
            return;
          }

          const ciRepo = ciResponse.repo;

          if (!ciRepo.active) {
            msg.reply(`Repository \`${repo.owner}/${repo.repo}\` is inactive.`);
            return;
          }

          robot.travis().repos(repo.owner, repo.repo).branches(repo.branch).get((err, ciResponse) => {
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
  });
};
