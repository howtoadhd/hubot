const jsdom = require('jsdom');
const jquery = 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';

// scrape a URL
// selectors: an array of jquery selectors
// callback: function that takes (error,response)
const scrapeHttp = (msg, url, selectors, callback) =>
  msg.http(url).get()((err, res, body) => {
    // http errors
    if (err) {
      callback(err, body);
      return;
    }
    jsdom.env(body, [jquery], (errors, window) => {
      // use jquery to run selector and return the elements
      const results = (selectors.map((selector) => window.$(selector).text().trim()));
      callback(null, results);
    });
  })
;

// fetch a ticket using http scraping
const ticketScrape = (msg, ticket_number) => {
  const ticket_url = `https://core.trac.wordpress.org/ticket/${ticket_number}`;
  const selectors = ['#trac-ticket-title', 'td[headers=h_reporter]', 'td[headers=h_owner]', '#ticket h2 .trac-status', 'td[headers=h_milestone] .milestone'];
  scrapeHttp(msg, ticket_url, selectors, (err, response) => {
    if (err) {
      msg.emote(`Error retrieving Trac ticket #${ticket_number}`);
    } else {
      const trac_title = response[0];
      const trac_reporter = response[1];
      let trac_owner = response[2];
      const trac_status = response[3];
      const trac_milestone = response[4];
      if (!trac_owner) {
        trac_owner = "(no owner)";
      }
      msg.send(`WP Trac ${ticket_url} ${trac_milestone}, ${trac_reporter}=>${trac_owner}, ${trac_status}, ${trac_title}`);
    }
  });
};

module.exports = robot =>

  // listen for ticket links
  robot.hear(/wp#([0-9]+)/ig, msg => {
    for (let match of msg.match) {
      // fetch ticket information using scraping or jsonrpc
      const ticket_number = match.slice(3);
      ticketScrape(msg, ticket_number);
    }
  });
