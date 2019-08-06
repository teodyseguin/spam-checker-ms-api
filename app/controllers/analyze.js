const respond = require('../utils').respond;
const Spamd = require("node-spamd");
const spamAssassinRules = require('../spamassassin-rules.json');
const config = require('../config.json');

/**
 * Check if fromName parameter is available.
 * @param {object} request 
 */
const isFromNameAvailable = (request) => {
  if (request.body.hasOwnProperty('fromName')) {
    return true;
  }

  return false;
};

/**
 * Check if subject paramer is available.
 * @param {object} request 
 */
const isSubjectAvailable = (request) => {
  if (request.body.hasOwnProperty('subject')) {
    return true;
  }

  return false;
};

/**
 * Check if body parameter is available.
 * @param {object} request 
 */
const isBodyAvailable = (request) => {
  if (request.body.hasOwnProperty('body')) {
    return true;
  }

  return false;
};

/**
 * Analyze the POST payload using spamassassin daemon from tcp-spamassassin service.
 * @param {object} request 
 * @param {object} response 
 */
const analyze = async (request, response) => {
  let env = process.env.NODE_ENV;
  let host = config[env].spamassassin_host;
  let port = config[env].spamassassin_port;
  let receiver = '';

  if (!isFromNameAvailable(request) && !isSubjectAvailable(request) && !isBodyAvailable(request)) {
    return;
  }

  let { fromName, subject, body } = request.body;
  let spamd  = new Spamd(fromName, receiver, host, port);

  spamd.evaluate(subject, body, (res, err) => {
    if (err) {
      console.log('Error connecting to Spam Assassin Daemon', err);
    }
    else {
      let { spam, evaluation, allowed, rules } = res;
      let message = '';
      let result = {};

      result.score = evaluation;

      for (let i = 0; i < rules.length; i++) {
        if (spamAssassinRules[rules[i]]) {
          let { areaTested, description, score } = spamAssassinRules[rules[i]];

          if (result[areaTested]) {
            result[areaTested].push({ problemFound: description, score });
          }
          else {
            result[areaTested] = [];
            result[areaTested].push({ problemFound: description, score });
          }
        }
      }

      if (spam) {
        message = `The message is a Spam and is evaluated with ${evaluation} points in a maximun of ${allowed}`;
        respond(result, response, 'success', 200, message);
      }
      else {
        message = `The message is not a Spam and is evaluated with ${evaluation} points in a maximun of ${allowed}`;
        // Result is return even not spam. to make email writing strategy more efficient
        respond(result, response, 'success', 200, message);
      }

      process.exit();
    }
  });
};

module.exports = {
  analyze
};
