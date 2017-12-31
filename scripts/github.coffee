module.exports = (robot) ->
  GitHubApi = require('github')
  github = new GitHubApi

  robot.hear /([a-z0-9._-]+\/)?([a-z0-9._-]+)#([0-9]+)/ig, (msg) ->
    for i in [0...msg.match.length]
      data = msg.match[i].split /\/|#/


      if data.length == 2
        if data[0] is 'wp' then continue
        data.unshift process.env.HUBOT_GITHUB_ORG

      if isNaN(data[2])
        return

      data = {
        "owner": data[0],
        "repo": data[1],
        "number": data[2],
      }

      github.issues.get data, (err, res) ->
        if err then return

        issue = res.data

        type = if issue.pull_request then 'Pull Request' else 'Issue'

        assignee = if issue.assignee then "  and  assigned  to  `#{issue.assignee.login}`" else ''

        msg.send "#{type}  `#{data.owner}/#{data.repo}##{data.number}`  by  `#{issue.user.login}`  is  `#{issue.state}`#{assignee}   #{issue.html_url}"

