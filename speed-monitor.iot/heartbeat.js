const { exec } = require('child_process');
const axios = require('axios');

const timestamp = new Date().getTime();
const { API_URL, API_KEY } = process.env;
  // POST token
axios.post(`${API_URL}/api/v1/token`, {
  api_key: API_KEY
}).then((response) => {
  const { token } = response.data.data
  // POST new speed data
  axios.post(`${API_URL}/api/v1/heartbeat`, {
    "isAlive":1
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    console.log(response.data);
  }).catch((error) => {
    console.error(error);
  });
});
