const fs = require('fs');
const path = require('path');

const directoryPath = 'C:\\speed-test';

const results = {
  highest: 0,
  lowest: 10000,
  runningTotal: 0,
  count: 0,
  speeds: []
}

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 

  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      console.log(`reading file ${file}:`);
      const things = fs.readFileSync(path.join(directoryPath, file), 'utf8');
      const timeStamp = file.split('.')[0];
      const date = new Date(parseInt(timeStamp));
      const json = JSON.parse(things);
       // update data 
       if (json.downloadSpeed > results.highest) {
        results.highest = json.downloadSpeed;
      } 
      if (json.downloadSpeed < results.lowest) {
        results.lowest = json.downloadSpeed;
      }
      results.runningTotal += json.downloadSpeed
      results.count += 1;
      results.speeds.push(json.downloadSpeed);
      console.log('Results:', {date,speed:json.downloadSpeed,  average: results.runningTotal / results.count});

    }
  });
  console.log('Final results:', {results, average: results.runningTotal / results.count});
  // sort the speeds
  results.speeds.sort((a, b) => a - b);
  // ignore the first and last X% of the speeds
  const sliceStart = Math.floor(results.speeds.length * 0);
  const sliceEnd = Math.floor(results.speeds.length * 1);
  const trimmedSpeeds = results.speeds.slice(sliceStart, sliceEnd);
  console.log('slicing', {sliceStart, sliceEnd, length: results.speeds.length});
  console.log('Trimmed speeds:', trimmedSpeeds);
  const trimmedAverage = trimmedSpeeds.reduce((acc, speed) => acc + speed, 0) / trimmedSpeeds.length;
  console.log('Trimmed average:', trimmedAverage);

  // group the speeds into buckets of 100
  const buckets = {};
  results.speeds.forEach(speed => {
    const bucket = Math.floor(speed / 100);
    if (!buckets[bucket]) {
      buckets[bucket] = 1;
    } else {
      buckets[bucket] += 1;
    }
  });
  console.log('Bucketed speeds:', buckets);

  // how many speeds are above 1000
  const above1000 = results.speeds.filter(speed => speed >= 1000).length;
  const below1000 = results.speeds.filter(speed => speed < 1000).length;
  console.log('Above 1000:', above1000);
  console.log('Below 1000:', below1000);

});
