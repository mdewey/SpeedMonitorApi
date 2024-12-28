const { addSpeedTest, getSpeedPoints } = require("./src/datastore.js");
const { createToken, validateToken } = require("./src/token.js");
const { validateApiKey } = require("./src/apiKeys.js");


const buildResponse = ({ 
  statusCode = 200, 
  data, 
  meta = {}
}) => {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data,
      meta: {
        ...meta,
        when: new Date().toISOString(),
      },
    }),
  };
};

const validateHeader = (event) => {
  const token = event.headers['authorization'].split(' ')[1];
  return validateToken({ token });
};

module.exports.hello = async () => {
  return buildResponse({
    data: {
      message: "ping!",
    },
  });
};


module.exports.saveSpeedDataPoint = async (event) => {
  const { isValid } = validateHeader(event);
  if (!isValid) {
    return buildResponse({
      statusCode: 403,
      data: {
        message: 'Forbidden'
      }
    });
  }
  const body = JSON.parse(event.body);
  const { metadata, point } = await addSpeedTest(body);
  return buildResponse({
    data: {
      point, 
    },
    meta:{
      params:{
        ...body
      },
      metadata
    }
  });
};

module.exports.getSpeedDataPoints = async (event) => {
  //get the token from the headers
  const { isValid } = validateHeader(event);
  if (!isValid) {
    return buildResponse({
      statusCode: 403,
      data: {
        message: 'Forbidden'
      }
    });
  }
  const { items, params } = await getSpeedPoints();
  return buildResponse({
    data: {
      points: items,
    },
    meta: {
      params,
    },
  });
};

module.exports.getToken = async (event) => {
  const body = JSON.parse(event.body);
  if (validateApiKey({ apiKey: body.api_key })) {
    const token = createToken({ apiKey: body.api_key });
    return buildResponse({
      data: {
        token
      }
    });
  } else{
    return buildResponse({
      statusCode: 403,
      data: {
        message: 'Forbidden'
      }
    });
  }
};