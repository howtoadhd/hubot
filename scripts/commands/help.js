module.exports = robot =>

  robot.respond(/help/i, msg => {
    const response = [
      '**Dev**',
      '```',
      'Hubot uptime                       - Show the status of the monitored sites',
      //'Hubot build status                 - Get the build status of all repos',
      //'Hubot build status <repo>          - Get the build status of <repo>',
      'Hubot rebuild <repo>               - Trigger a TravisCI build for <repo>\'s default branch',
      //'Hubot rebuild <repo> <branch>      - Trigger a TravisCI build for <branch> of <repo>',
      //'Hubot cancel build <repo>          - Cancel a TravisCI build for <repo>\'s default branch',
      //'Hubot cancel build <repo> <branch> - Cancel a TravisCI build for <branch> of <repo>',
      '```',

      '**Issues**',
      '```',
      'wp#<ticket_id>           - Get info about a WordPress trac ticket',
      '<repo>#<issue_id>        - Get info about a github issue on one of our repos',
      '<team>/<repo>#<issue_id> - Get info about a github issue on another teams repo',
      '```',

      '**Team**',
      '```',
      'Hubot tell <recipients> <some message> - tell <recipients> <some message> next time they are present.',
      'Hubot tz                               - Show team\'s local time across time zones via timezone.io',
      '```',

      '**Just For Fun**',
      '```',
      'Hubot the rules            - Make sure Hubot still knows the rules.',
      'Hubot open the <type> door - Self explanatory really.',
      '```',

      '**Profile**',
      '```',
      'github link   - Link your GitHub account to me.',
      'github unlink - Unlink your GitHub account from me.',
      '```',
    ];

    const emit = response.join('\n');

    msg.send(emit);
  });
