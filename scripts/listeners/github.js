module.exports = robot =>

  robot.hear(/([a-z0-9._-]+\/)?([a-z0-9._-]+)#([0-9]+)/ig, msg => {
    for (let match of msg.match) {
      let data = match.split(/[\/|#]/);


      if (data.length === 2) {
        if (data[0] === 'wp') {
          continue;
        }
        data.unshift(process.env.HUBOT_GITHUB_ORG);
      }

      if (isNaN(data[2])) {
        return;
      }

      data = {
        "owner": data[0],
        "repo": data[1],
        "number": data[2],
      };

      robot.github().issues.get(data, (err, res) => {
        if (err) {
          return;
        }

        const issue = res.data;
        const type = issue.pull_request ? 'Pull Request' : 'Issue';
        const assignee = issue.assignee ? `  and  assigned  to  \`${issue.assignee.login}\`` : '';

        return msg.send(`${type}  \`${data.owner}/${data.repo}#${data.number}\`  by  \`${issue.user.login}\`  is  \`${issue.state}\`${assignee}   ${issue.html_url}`);
      });
    }
  });
