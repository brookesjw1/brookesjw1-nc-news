const ENV = process.env.NODE_ENV || "development";

console.log(ENV);

const testData = require('./data/test-data');
const devData = require('./data/development-data');
const data = {
    development: devData,
    test: testData
  };
  
  module.exports = data[ENV];