# Speed Monitor System

## Speed Monitor API

AWS Lambda + Serverless + Dyanamo Db

endpoints

|method| url|
|---|---|
|GET  | <http://localhost:3000/api/v1/ping>|
|POST | <http://localhost:3000/api/v1/speed>|
|GET  | <http://localhost:3000/api/v1/speed>|
|POST | <http://localhost:3000/api/v1/token>|
|POST | <http://localhost:3000/api/v1/heartbeat> |

## Speed Monitor IoT

2 scripts

### Wifi Checker

Node script that sends data, enabled on my laptop as a background job

### Heartbeat

Node script that heart beats every X minutes

## Speed Monitor Website

Vite (react + TS)
deployed to netlify + google domains

## Speed Monitor WatchDog

TODO: Create
