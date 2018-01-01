module.exports = (robot) ->

  robot.receiveMiddleware (context, next, done) ->
    room = context.response.message.room
    next() if room == process.env.HUBOT_ROOM_ID
    done()
