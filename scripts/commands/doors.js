module.exports = robot =>

  robot.respond(/open the (.*) door/i, res => {
    const doorType = res.match[1];

    if (doorType === "pod bay") {
      res.reply("I'm afraid I can't let you do that.");
    } else {
      res.reply(`Opening ${doorType} doors`);
    }
  });
