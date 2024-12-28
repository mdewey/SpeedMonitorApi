const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const REGION = process.env.REGION || 'us-east-1';
const TABLE_NAME = process.env.TABLE_NAME || 'speed-test-results-dev';
const DEFAULT_LOCATION = process.env.DEFAULT_LOCATION || 'The Rusty Dragon';

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


const addSpeedTest = async ({ 
  downloadSpeed, 
  daysToLive = 14, 
  trackedLocation = DEFAULT_LOCATION 
}) => {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions,
  });
  const point = {
    downloadSpeed,
    timestamp: new Date().toISOString(),
    id: uuidv4(),
    ttl: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * daysToLive,
    tracked_location:trackedLocation,
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

const getSpeedPoints = async () => {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions,
  });
  // query for items that are in the default locaiton 
  const params = {
    TableName: TABLE_NAME,
    IndexName: 'tracked_location-index',
    KeyConditionExpression: 'tracked_location = :tracked_location',
    ExpressionAttributeValues: {
      ':tracked_location': DEFAULT_LOCATION,
    },
  };
  

  const { Items } = await ddbDocClient.send(new QueryCommand(params));
  return { params, items: Items };



};


module.exports = {
  addSpeedTest,  
  getSpeedPoints
};