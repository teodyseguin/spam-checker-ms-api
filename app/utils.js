'use strict';

const respond = (result, response, statusType, statusCode = null, message = null) => {
  if (statusCode) {
    response.status(statusCode);
  }

  response.send({ status: statusType, result, message });
  response.end();
}

module.exports = {
  respond
};
