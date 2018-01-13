const
  crypto = require('crypto');

module.exports = robot => {

  robot.router.post('/webhooks/travis', (req, res) => {

    if (!req.body.payload) {
      res.json({error: 'Invalid payload.'});
      return;
    }

    if (!req.headers.signature) {
      res.json({error: 'Unsigned Request'});
      return;
    }

    const travisSignature = Buffer.from(req.headers.signature, 'base64');
    let payload = req.body.payload;

    robot.travis().config.get((err, ciRes) => {
      if (err) {
        res.json({error: 'Unable to get TravisCI public key.'});
        return;
      }
      const travisPublicKey = ciRes.config.notifications.webhook.public_key;

      const signed = crypto
        .createVerify('sha1')
        .update(payload)
        .verify(travisPublicKey, travisSignature);

      if (signed) {
        payload = JSON.parse(payload);

        const type = payload.pull_request ? "Pull Request" : "Branch";

        let status, emoji;
        switch (payload.status_message) {
          case "Pending":
            emoji = "❕";
            status = "is pending 😀";
            break;
          case "Passed":
            emoji = "✅";
            status = "has passed 😀";
            break;
          case "Fixed":
            emoji = "✅";
            status = "is fixed 😀";
            break;
          case "Broken":
            emoji = "❌";
            status = "is broken 😟";
            break;
          case "Failed":
            emoji = "❌";
            status = "has failed 😟";
            break;
          case "Still Failing":
            emoji = "❌";
            status = "is still failing 😟";
            break;
          case "Canceled":
            emoji = "❕";
            status = "was canceled 😱";
            break;
          case "Errored":
            emoji = "❗";
            status = "has errored 😡";
            break;
          default:
            res.json({});
            return;
            break;
        }

        robot.messageRoom(process.env.HUBOT_DISCORD_ROOM_ID, `${emoji} Build ${payload.id} of ${type} ${payload.repository.name}#${payload.branch} by ${payload.author_name} ${status} ${payload.build_url}`);
        res.json({});
      }
    });
  });
};
