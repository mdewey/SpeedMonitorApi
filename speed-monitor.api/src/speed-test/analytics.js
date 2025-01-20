const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand
} = require('@aws-sdk/lib-dynamodb');
const { isEverythingOkay } = require('../heartbeat/analytics');

const REGION = process.env.REGION || 'us-east-1';
const TABLE_NAME = process.env.SPEED_TEST_TABLE_NAME || 'speed-test-results-dev';
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
  Items.sort((a, b) => a.ttl - b.ttl);
  return { params, items: Items };
};



const getCurrentStatus = async () => {
  const { items:points } = await getSpeedPoints();

  // remove the top 10% and bottom 10% of the data
  const sortedPoints = points.map((point) => point.downloadSpeed).sort();
  const sliceIndex = Math.floor(sortedPoints.length * 0.1);
  const slicedPoints = sortedPoints.slice(sliceIndex, sortedPoints.length - sliceIndex);
  const slicedAverage = slicedPoints
    .reduce((acc, point) => acc + point, 0) / slicedPoints.length;
  const dateRange = {
    oldest: points.reduce((acc, point) => {
      if (!acc) return point;
      return new Date(acc.timestamp) < new Date(point.timestamp) ? acc : point;
    }, null),
    newest: points.reduce((acc, point) => {
      if (!acc) return point;
      return new Date(acc.timestamp) > new Date(point.timestamp) ? acc : point;
    }, null),
  };
  const rv = {
    count: points.length,
    isEverythingOkay: slicedAverage > 1000,
    slicedAverage,
    dateRange
  };

  return rv;
};


module.exports = {
  getCurrentStatus
};