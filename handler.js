const { addSpeedTest, getSpeedPoints } = require("./src/datastore.js");



const buildResponse = ({ 
  statusCode = 200, 
  data, 
  meta = {
    when: new Date().toISOString(),
  }
}) => {
  return {
    statusCode,
    body: JSON.stringify({
      data,
      meta,
    }),
  };
};

module.exports.hello = async () => {
  return buildResponse({
    data: {
      message: "ping!",

    },
  });
};


module.exports.saveSpeedDataPoint = async (event) => {
  // parse the incoming request body as JSON 
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
  const data = await getSpeedPoints({});
  return buildResponse({
    data: {
      message: "Speed data points retrieved!",
      data,
    },
  });
};