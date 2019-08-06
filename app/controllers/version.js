const respond = require('../utils').respond;

const version = async (request, response) => {
  respond({ version: 1 }, response, 'success', 200);
};

module.exports = {
  version
};