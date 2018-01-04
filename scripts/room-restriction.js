module.exports = robot =>

  robot.receiveMiddleware((context, next, done) => {
    if (context.response.message.room === process.env.HUBOT_DISCORD_ROOM_ID) {
      next();
    }
    done();
  });
