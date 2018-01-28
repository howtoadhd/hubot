const
  moment = require('moment-timezone'),
  querystring = require('querystring'),
  request = require("request"),
  root_url = process.env.HUBOT_DISCOURSE_URL,
  api_username = process.env.HUBOT_DISCOURSE_API_USERNAME,
  api_key = process.env.HUBOT_DISCOURSE_API_KEY;

let
  allowed_roles = (process.env.HUBOT_DISCOURSE_MOD_ALLOWED_ROLES || '').split(','),
  allowed_users = (process.env.HUBOT_DISCOURSE_MOD_ALLOWED_USERS || '').split(',');

const is_authorized = (user) => {
  for (let i = 0; i < user.roles.length++; i++) {
    let role = user.roles[i];

    if (allowed_roles.indexOf(role) > -1) {
      console.log('Mod Authorized by role');
      return true;
    }
  }

  if (allowed_users.indexOf(user.id) > -1) {
    console.log('Mod Authorized by user id');
    return true;
  }
  console.log('Mod Unauthorized');
  return false;
};

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

  robot.respond(/forum mod (\S+)$/i, msg => {
    if (!is_authorized(msg.envelope.user)) {
      msg.reply('Im afraid i cant let you do that!');
      return;
    }

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
        user_id = body.user.id,
        is_mod = body.user.moderator,
        data = querystring.stringify({
          'api_key': api_key,
          'api_user': api_username
        });

      if (is_mod) {
        msg.send(`User \` ${msg.match[1]} \` is already a forum mod.`);
        return;
      }

      request({
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: `${root_url}/admin/users/${user_id}/grant_moderation`,
        body: data,
        method: 'PUT',
      }, function (err, response, body) {
        if (err) {
          msg.send(`The forums are confusing me: ${err}`);
          return;
        }
        msg.send(`User \` ${msg.match[1]} \` is now a forum mod.`);
      });
    });
  });

  robot.respond(/forum unmod (\S+)$/i, msg => {
    if (!is_authorized(msg.envelope.user)) {
      msg.reply('Im afraid i cant let you do that!');
      return;
    }

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
        user_id = body.user.id,
        is_mod = body.user.moderator,
        data = querystring.stringify({
          'api_key': api_key,
          'api_user': api_username
        });

      if (!is_mod) {
        msg.send(`User \` ${msg.match[1]} \` is not a forum mod.`);
        return;
      }

      request({
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: `${root_url}/admin/users/${user_id}/revoke_moderation`,
        body: data,
        method: 'PUT',
      }, function (err, response, body) {
        if (err) {
          msg.send(`The forums are confusing me: ${err}`);
          return;
        }
        msg.send(`User \` ${msg.match[1]} \` is no longer a forum mod.`);
      });
    });
  });
};
