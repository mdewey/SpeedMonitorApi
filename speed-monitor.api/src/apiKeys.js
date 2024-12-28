

const API_KEYS = process.env.API_KEYS.split(',');

const validateApiKey = ({ apiKey }) => {
  return API_KEYS.includes(apiKey);
};

module.exports = {
  validateApiKey
};