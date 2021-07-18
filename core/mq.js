const amqp = require('amqplib/callback_api');
const { consumePayment } = require("../interface/amqp/consumers/consumer");

const AMQP = "amqp";
const RETRY_INTERVAL = 5000;

// filter message types and consume appropriately
var _consumeMessage = (content) => {
  // console.log("consuming message with default consumer: %s", content)
  consumePayment(content);
};


// this method will return amqp connection params
// based on the configuration
function _getConnectionParams(env) {
  return {
    connectionString: `${AMQP}://${env.amqp.host}`,
    exchange: env.amqp.exchange,
    exchangeType: env.amqp.exchangeType
  };
}

function _handleUnexpectedClose(appConfig) {
  console.error("[AMQP] reconnecting");
  return setTimeout(connectToMQ, RETRY_INTERVAL, appConfig);
}


function connectToMQ(appConfig) {
  console.log("Connecting to message queue...");

  const {
    connectionString, exchange, exchangeType
  } = _getConnectionParams(appConfig);

  amqp.connect(connectionString, function(error0, connection) {
    if (error0) {
      console.log("Unable to connect to AMQP");
      console.error(error0);
      _handleUnexpectedClose(appConfig);
      return;
    }
    // handle error | close event
    connection.on("error", ()=>_handleUnexpectedClose(appConfig));
    connection.on("close", ()=>_handleUnexpectedClose(appConfig));

    // create channel
    connection.createChannel(function(error1, channel) {
      if (error1) {
        console.log("Unable to create AMQP channel");
        console.error(error1);
        return
      } else {
        console.log(`Connected to MQ successfully`);
      }

      // create exchange
      channel.assertExchange(exchange, exchangeType, {
        durable: false
      }, callback = (error2)=>{
        if(error2) {
          console.log("Unable to create AMQP exchange");
          // _mqChannel = null; 
        }
      });

      // create queue
      channel.assertQueue('', {
        exclusive: true
      }, function(error3, q) {
        if (error3) {
          console.log("Unable to create AMQP queue");
          console.error(error3);
        }

        // bind queue to exchange
        channel.bindQueue(q.queue, exchange, '');
  
        channel.consume(q.queue, function(msg) {
          if(msg.content) {
            console.log(" [x] %s", msg.content.toString());
              _consumeMessage(msg.content.toString());
            }
        }, {
          noAck: true
        });
      });
    });
  });  
};


module.exports.registerListener = (listener) => {
  _consumeMessage = listener;
}

module.exports.connectToMQ = connectToMQ