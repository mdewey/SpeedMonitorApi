const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand
} = require('@aws-sdk/lib-dynamodb');

const REGION = process.env.REGION || 'us-east-1';
const TABLE_NAME = process.env.HEART_BEAT_TABLE_NAME || 'heart-beat-dev';
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

const getHeartBeat = async () => {
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
  // sor to return latest first
  Items.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  return { params, items: Items };
};


const isEverythingOkay = async () => {
  const { items } = await getHeartBeat();
  // if the heartbeat happened in the last 5 miuntes, we are okay
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
  console.log({ items });
  const rv = {
    isAlive: items.length > 0 && items[0].timestamp > fiveMinutesAgo.toISOString(),
    lastHeartBeat : items[0]
  };  
  return rv;
};


module.exports = {
  isEverythingOkay
};