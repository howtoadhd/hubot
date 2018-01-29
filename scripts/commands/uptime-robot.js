const uptime_robot = require('uptime-robot');
const apikey = process.env.HUBOT_UPTIMEROBOT_APIKEY;
const client = new uptime_robot(apikey);

const decodeHtmlEntity = str =>
  str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

module.exports = robot =>

  robot.respond(/uptime/i, msg =>
    client.getMonitors({customUptimeRatio: [1, 7, 30]}, (err, res) => {
      if (err) {
        msg.send(`Uptime robot is confusing me: ${err}`);
        return;
      }

      for (let monitor of res) {
        let status;
        switch (monitor.status) {
          case "1":
            status = "⏸ paused";
            break;
          case "2":
            status = "✅ up";
            break;
          case "8":
            status = "🤷 seems down";
            break;
          case "9":
            status = "❌ down";
            break;
          default:
            status = "unknown";
        }

        const name = decodeHtmlEntity(monitor.friendlyname);

        const response = [
          `**${name}**   \`${monitor.url}   ${monitor.port}\``,
          '```',
          `  Current   ${status}`,
          `  1 Day     ${monitor.customuptimeratio[0]}%`,
          `  7 Days    ${monitor.customuptimeratio[1]}%`,
          `  30 Days   ${monitor.customuptimeratio[2]}%`,
          `  All Time  ${monitor.alltimeuptimeratio}%`,
          '```',
        ];

        const emit = response.join('\n');

        msg.send(emit);
      }
    })
  );
