const { exec } = require('child_process');
const axios = require('axios');

const timestamp = new Date().getTime();

const command = `fast --json`;
console.log(`running command: ${command}`);
exec(command, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.log(err)
    return;
  }
  const result = JSON.parse(stdout);
  const { API_URL, API_KEY } = process.env;
  // POST token
  axios.post(`${API_URL}/api/v1/token`, {
    api_key: API_KEY
  }).then((response) => {
    const { token } = response.data.data
    // POST new speed data
    axios.post(`${API_URL}/api/v1/speed`, {
      downloadSpeed: result.downloadSpeed,
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
});