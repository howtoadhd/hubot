module.exports = (robot) ->
  uptime_robot = require 'uptime-robot'
  apikey = process.env.HUBOT_UPTIMEROBOT_APIKEY
  client = new uptime_robot(apikey);

  decodeHtmlEntity = (str) ->
    return str.replace /&#(\d+);/g, (match, dec) ->
      return String.fromCharCode dec


  getMonitors = (msg) ->
    client.getMonitors {customUptimeRatio: [1, 7, 30]}, (err, res) ->
      if err
        msg.send "Uptime robot is confusing me: #{err}"
        return

      for monitor in res
        switch monitor.status
          when "1" then status = "⏸ paused"
          when "2" then status = "✅ up"
          when "8" then status = "🤷 seems down"
          when "9" then status = "❌ down"
          else
            status = "unknown"

        name = decodeHtmlEntity monitor.friendlyname

        message = "**#{name}**   #{monitor.url}   #{monitor.port}\n```"
        message += "  Current   #{status}\n"
        message += "  1 Day     #{monitor.customuptimeratio[0]}%\n"
        message += "  7 Days    #{monitor.customuptimeratio[1]}%\n"
        message += "  30 Days   #{monitor.customuptimeratio[2]}%\n"
        message += "  All Time  #{monitor.alltimeuptimeratio}%```"

        msg.send message

  robot.respond /uptime/i, getMonitors
