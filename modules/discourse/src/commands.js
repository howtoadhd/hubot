const moment = require('moment-timezone');

const
  root_url = process.env.HUBOT_DISCOURSE_URL,
  api_username = process.env.HUBOT_DISCOURSE_API_USERNAME,
  api_key = process.env.HUBOT_DISCOURSE_API_KEY;

module.exports = (robot) => {

  robot.respond(/forum user (\S+)$/i, msg => {
    robot.http(`${root_url}/users/${msg.match[1]}.json`).get()((err, response, body) => {
      if (err) {
        msg.send(`The forums are confusing me: ${err}`);
        return;
      }

      body = JSON.parse(body);

      if (body.error_type && body.error_type === "not_found") {
        msg.send(`User \` ${msg.match[1]} \` does not exist.`);
        return;
      }

      const
        user = body.user,
        tz_format = (time) => moment.utc(time).format('ddd DD MMM YYYY hh:mm A z'),
        res = [
          '```',
          `  ID           ${user.id}`,
          `  Username     ${user.username}`,
          `  Name         ${user.name}`,
          `  Joined       ${tz_format(user.created_at)}`,
          `  Last Seen    ${tz_format(user.last_seen_at)}`,
          `  Last Posted  ${tz_format(user.last_posted_at)}`,
          `  Trust Level  ${user.trust_level}`,
          `  Admin        ${user.admin}`,
          `  Moderator    ${user.moderator}`,
          '```',
        ],
        emit = res.join('\n');

      msg.send(emit);
    });
  });
};
