// var SIM = function (initBotinfo, initPrice ) {

//     var marketMaker = require('./marketMaker.js');
//     var traderMaker = require('./traderSetup.js');

// /*
//     //{tradeLedger} JSON Obj, stores everytrade
//     var tradeLedger = { "trades":[{"buyer":"Bot1_name", "seller":"Bot2_name", "timeOfTrade":1439254635102, "price":50, "stock":'goog'}]
//     };
// */
// /*    
//     var stocks = {
//         "goog": { count: 0, attitude: 0 },
//         "appl": { count: 0, attitude: 0 },
//         "fb": { count: 0, attitude: 0 },
//         "amzm": { count: 0, attitude: 0 },
//         "twtr": { count: 0, attitude: 0 },
//         "msft": { count: 0, attitude: 0}
//     };
// */
//     //bot array with all the bots
//     var botArray = [];

//     //loop thought initBotinfo obj to create bots
//     for (var key in initBotinfo) {
//        if (initBotinfo.hasOwnProperty(key)) {
//            var obj = initBotinfo[key];
//             //console.log(key);

//             var currentBot = new traderMaker(key, obj.balance, obj.character, obj.quantity, obj.interests, obj.active, obj.riskTolerance, obj.stepSize, obj.attitude)
//             botArray.push(currentBot);
//             /*
//             for (var prop in obj) {
//               // important check that this is objects own property 
//               // not from prototype prop inherited
//               if(obj.hasOwnProperty(prop)){
//                 console.log(prop + " = " + obj[prop]);
//               }
//             }
//             */
//         }
//     };
//     //console.log(botArray);
//     //setup market maker     
//     var marketMakerBot = new marketMaker(botArray, initPrice); 
//     //make the world go round
//     //var simPrice = marketMakerBot.marketMakersPrice
//     console.log("This is market starting price " + marketMakerBot.marketMakersPrice)
//     marketMakerBot.service(trend);

//     //var currentPrice = marketMakerBot.returnPrice();

// };


// var trend = {twitterAPI: 5555};

// //var marketPrice = null;

// //{stockListing} JSON obj, stores the current value of stock
// //which would need to be grabbed from the database
// //var stockListing = { "market":[ {"GOOG": 500} ] };
// //var price = stockListing.market[0].GOOG;

// module.exports = SIM;
// module.exports.trend = trend;

// //module.exports.marketPrice = marketPrice;