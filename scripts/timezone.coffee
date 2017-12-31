moment = require 'moment-timezone'

timezoneio_url = process.env.HUBOT_TIMEZONEIO_URL || 'https://timezone.io/team/buffer'

data_regex = /appData = (.*);/g

String.prototype.pad_r = (l,c) ->
  this+Array(l-this.length+1).join(c||" ")

get_tzdata = (robot, msg) ->
  robot.http(timezoneio_url).get() (err, result, body) ->
    if m = data_regex.exec body
      matched_data = m[1]
      data = JSON.parse matched_data
      cur_time = new Date().getTime()
      tz_name_pad = Math.max.apply @, (z.tz.length for z in data.timezones)
      output = for z in data.timezones
        time = moment(cur_time).tz(z.tz)
        tz_name = z.tz.pad_r tz_name_pad
        tz = "#{time.format('ZZ z')}".pad_r 11
        time = time.format("ddd hh:mmA").pad_r 11
        names = (person.name for person in z.people).join(', ')
        "[#{time} #{tz} #{tz_name}] #{names}\n"
      output = output.join('')
      msg.send output

module.exports = (robot) ->
  robot.respond /tz/i, (msg) ->
    get_tzdata(robot, msg)

