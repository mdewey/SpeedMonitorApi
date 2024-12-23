const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const { time } = require('console');

const { v4: uuidv4 } = require('uuid');

const REGION = process.env.REGION || 'us-east-1';
const TABLE_NAME = process.env.TABLE_NAME || 'speed-test-results-dev';

const marshallOptions = {
  convertEmptyValues: false, // false, by default.
  removeUndefinedValues: true, // false, by default.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  wrapNumbers: false, // false, by default.
};

const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});


const addSpeedTest = async ({ downloadSpeed, daysToLive = 30 }) => {
  console.log('adding speed test', { downloadSpeed });
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions,
  });
  const point = {
    downloadSpeed,
    timestamp: new Date().toISOString(),
    id: uuidv4(),
    ttl: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * daysToLive,
  };

  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...point,      
    },
  };

  const metadata = await ddbDocClient.send(new PutCommand(params));
  return { metadata, point };
};

const getSpeedPoints = async ({}) => {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions,
  });

  const params = {
    TableName: TABLE_NAME,
  };


  const data = await ddbDocClient.send(new QueryCommand(params));
  const rv = data.Items[0];
  console.log('data', data);
  return rv;
};


module.exports = {
  addSpeedTest,  
  getSpeedPoints
};