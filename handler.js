
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

module.exports.hello = async (event) => {
  console.log(process.env);
 return buildResponse({
    data: {
      message: "ping!",

    },
  });
};


module.exports.saveSpeedDataPoint = async (event) => {
  // parse the incoming request body as JSON 
  const body = JSON.parse(event.body);
 return buildResponse({
    data: {
      message: "Speed data point saved!",
    },
    meta:{
      params:{
        ...body
      }
    }
  });
};

module.exports.getSpeedDataPoints = async (event) => {
  return buildResponse({
    data: {
      message: "Speed data points retrieved!",
    },
  });
}