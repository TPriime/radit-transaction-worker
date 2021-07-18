const checkIfEnvIsValid = require("./config").checkIfEnvIsValid;
const mongoose = require("mongoose");

const MONGODB = "mongodb";
const RETRY_INTERVAL = 5000;

// this method will return mongodb connection uri (string)
// based on the configuration
function _getConnectionString(env) {
  // just a basic check
  if (!checkIfEnvIsValid(env)) {
    throw "Passed invalid environment";
  }
  return `${MONGODB}://${env.db.host}:${env.db.port}/${env.db.name}`; 
}


function connectToDB (appConfig) {
  console.log("Connecting to db...");

  // connecting to database here
  mongoose.connect(
    _getConnectionString(appConfig),
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (error) => {
      // if connection was failed, then it prints out the error and exits
      if (error) {
        console.log("Unable to connect to db");
        console.error(error);
        // retry on error
        console.error("[DB] reconnecting");
        setTimeout(connectToDB, RETRY_INTERVAL, appConfig);
      } else {
        // connection is successful prints out which db is connected to
        console.log(`Connected to db ${appConfig.db.name} successfully`);
      }
    }
  );
};


module.exports.connectToDB = connectToDB;