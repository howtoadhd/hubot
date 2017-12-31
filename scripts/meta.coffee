module.exports = (robot) ->
  robot.respond /META$/i, (msg) ->
    response = [
      '😱 You found my hidden debug commands',
      '```',
      'Hubot meta adapter     - Reply with the adapter'
      'Hubot meta echo <text> - Reply back with <text>'
      'Hubot meta ping        - Reply with pong'
      'Hubot meta time        - Reply with current server time'
      '```',
    ]

    emit = response.join '\n'

    msg.send emit

  robot.respond /META PING$/i, (msg) ->
    msg.send "PONG"

  robot.respond /META ADAPTER$/i, (msg) ->
    msg.send robot.adapterName

  robot.respond /META ECHO (.*)$/i, (msg) ->
    msg.send msg.match[1]

  robot.respond /META TIME$/i, (msg) ->
    msg.send "Server time is: #{new Date()}"
