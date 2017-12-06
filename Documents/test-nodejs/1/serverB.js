const net = require("net");
const API_KEY="58e3650ebdca4e5abab48444fb607001";
const API_SECRET="55d7ff8b1cc34a6ebc68b9f780ab2236";
var bittrex = require('node-bittrex-api');
//seeting nitrex options
bittrex.options({
  'apikey' : API_KEY,
  'apisecret' : API_SECRET,
  'verbose' : true,
  'stream' : true, 
});

// Create a simple server
var server = net.createServer(function (conn) {
    console.log("Server: Client connected");

   // If connection is closed
    conn.on("end", function() {
        console.log('Server: Client disconnected');
        // Close the server
        server.close();
        // End the process
        process.exit(0);
    });

    //connection biitex websocket for data
    bittrex.websockets.listen(function(data, client) {
        
        if (data.M === 'updateSummaryState') {
          var arr=[];
          //data.A.forEach(function(data_for) {
            //console.log(data_for.Deltass);
            data.A[0].Deltas.forEach(function(marketsDelta) {
            // console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
             arr.push({name:marketsDelta.MarketName,price:marketsDelta.High});
            });
          //});
          //sending data to the another server
          conn.write(JSON.stringify({response:arr}))
        }
      });

    });

// Listen for connections B
server.listen(61337, "localhost", function () {
    console.log("Server: Listening");
});