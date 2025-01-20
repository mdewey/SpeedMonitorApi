const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const REGION = process.env.REGION || 'us-east-1';
const TABLE_NAME = process.env.TABLE_NAME || 'heart-beat-dev';
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


const addHeartBeat = async ({ 
  trackedLocation = DEFAULT_LOCATION 
}) => {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions,
  });
  const ttl = Math.floor(Date.now() / 1000) + (60 * 10) ;
  const beat = {
    timestamp: new Date().toISOString(),
    id: uuidv4(),
    ttl: ttl,
    tracked_location:trackedLocation,
  };

  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...beat,      
    },
  };

  const metadata = await ddbDocClient.send(new PutCommand(params));
  return { metadata, beat };
};



module.exports = {
  addHeartBeat
};