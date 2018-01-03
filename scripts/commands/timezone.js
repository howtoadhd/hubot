const moment = require('moment-timezone');
const timezoneio_url = process.env.HUBOT_TIMEZONEIO_URL || 'https://timezone.io/team/howtoadhd';

module.exports = robot =>
  robot.respond(/tz$/i, (msg) =>
    robot.http(timezoneio_url).get()((err, result, body) => {
      const
        m = body.match(/appData = (.*);/),
        now = new Date().getTime(),
        response = [];

      if (m) {
        let
          data = JSON.parse(m[1]),
          zone;

        for (zone of data.timezones) {
          let
            name = zone.tz,
            names = (zone.people.map((person) => person.name)).join(',   '),
            time = moment(now).tz(zone.tz),
            timezone = time.format('ZZ z');

          time = time.format("ddd hh:mmA");

          response.push(`\`\`\`\n${time}   ${timezone}   ${name} \n${names}\n\`\`\``);
        }
        msg.send(response.join(' '))
      }
    })
  );

