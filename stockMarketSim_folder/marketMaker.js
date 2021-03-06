// |MarketMaker| Constructor
var MarketMaker = function (initBotsArray, initStocksArray) {
console.log('marketMakerConstructor loaded...')

	var self = this;
	//hold input stock info name and price of each stock
	this.marketStockListing = initStocksArray;
	this.marketTraderBots = initBotsArray;
	this.marketTraderWrap = 9000;
	this.marketTraderTradeCount = 0;
	this.marketTraderTradeReport = {};
	//current trade attr so outsider can grab that info
	this.currentTraderPairId = [];
	this.currentTradeStockName = null;
	this.currentTradeStockPrice = null;
	//current twitter update session, reset after a trade cycle
	this.stockOfInterestName = [];
	this.stockOfInterestPrice = [];
	this.trendValue = null;
	this.botsInterestedInTrading = [];

	this.yell = function (state) {
		var currentState = null;
		if (state == 'start') {
			currentState = ' current price: ';
		}else if (state == 'finish') {
			currentState = ' new price: ';
		};
		for (var y = 0; y < self.marketStockListing.length; y++) {
			console.log('>> >> ' + self.marketStockListing[y].name + currentState + self.marketStockListing[y].price + ' << <<');
		};
	};
	// discover the twitter stream and hold the data
	this.discover = function (twitterUpdatesInput) {
		//console.log(twitterUpdatesInput);
		for (var t = 0; t < twitterUpdatesInput.length; t++) {
			var currentTwitStock = twitterUpdatesInput[t].symbol.toUpperCase();
			self.stockOfInterestName.push(currentTwitStock);

			//find price of stocks
			for (var p = 0; p < self.marketStockListing.length; p++) {
				if (currentTwitStock == self.marketStockListing[p].name) {
					self.stockOfInterestPrice.push(self.marketStockListing[p].price);
				};
			};
		};
		self.trendValue = twitterUpdatesInput[0].pchange;
	};
	// pass info to bots so bot can decide what they want to do
	this.pass = function () {
		for (var s = 0; s < self.stockOfInterestName.length; s++) {
			//console.log(self.stockOfInterestName[s] + " is on the table...");
			var currentStock = self.stockOfInterestName[s];

			for (var b = 0; b < self.marketTraderBots.length; b++) {
				// find which bot is interested
				if (currentStock == self.marketTraderBots[b].stockinterest) {
					console.log(self.marketTraderBots[b].name + " now learning about " + self.marketTraderBots[b].stockinterest +  " trend.");
					
					//pass the price data down the line
					self.botsInterestedInTrading.push(self.marketTraderBots[b]);
					self.marketTraderBots[b].track(self.stockOfInterestPrice[s], self.trendValue);
				};
			};
		};
		
	};
	// input a stock name to set the stock price of that symbol
	this.setStockPrice = function (oneStockName, oneStockPrice) {
		//sets marketMaker's obj stocks price to new price
		for (var p = 0; p < self.marketStockListing.length; p++) {
			if (self.marketStockListing[p].name == oneStockName) {
				self.marketStockListing[p].price = oneStockPrice;
				console.log(self.marketStockListing[p].price + " is new price of " + oneStockName);
			};
		};
	};
	//stages trade between bots
	this.stage = function () {
		//console.log(self.botsInterestedInTrading);
		
		//loop though each stock and each bot to see who want to trade what
		for (var t = 0; t < self.stockOfInterestName.length; t++) {

			//run though each trader to see if they want to trade
			var currentStock = self.stockOfInterestName[t];
			var buyer = null;
			var buyerUrgency = -1;
			var seller = null;
			var sellerUrgency = -1;
			var pair = [];
			// reset for each new trade
			self.currentTraderPairId = [];
			self.currentTradeStockName = null;
			self.currentTradeStockPrice = null;

			//check if bots are trading the same stock
			for (var o = 0; o < self.botsInterestedInTrading.length; o++) {
				//find buyer
				if (self.botsInterestedInTrading[o].lookingForTrade == true && self.botsInterestedInTrading[o].orderType == "BUY" && self.botsInterestedInTrading[o].stockinterest == currentStock) {
					//check who has most urgency
					if (self.botsInterestedInTrading[o].urgency > buyerUrgency) {
						buyerUrgency = self.botsInterestedInTrading[o].urgency;
						buyer = self.botsInterestedInTrading[o];
					};
				};
				//find seller
				if (self.botsInterestedInTrading[o].lookingForTrade == true && self.botsInterestedInTrading[o].orderType == "SELL" && self.botsInterestedInTrading[o].stockinterest == currentStock) {
					//check who has most urgency
					if (self.botsInterestedInTrading[o].urgency > sellerUrgency) {
						sellerUrgency = self.botsInterestedInTrading[o].urgency;
						seller = self.botsInterestedInTrading[o];
					};
				};
			};

			console.log("We got ourselves a trade!");
			// sends of the traders to settle trade
			pair = [buyer, seller];
			//settle the trade between the pair
			var newStockPrice = self.settle(pair, self.stockOfInterestPrice[t], self.stockOfInterestName[t]);
			console.log(self.stockOfInterestName[t] + " after trade price is ---------->" + newStockPrice);
			
			//set price of stock after the trade
			self.setStockPrice(self.stockOfInterestName[t], newStockPrice);
			//update marketMaker bot attr 
			self.currentTraderPairId = [buyer, seller];
			self.currentTradeStockName = self.stockOfInterestName[t];
			self.currentTradeStockPrice = newStockPrice;

			//finished 1 single trade
			self.marketTraderTradeCount++;
		};

	};
	//settle trades between initBotsArray
	this.settle = function (pairInput, stockPriceInput, stockName) {
		//reset single trade report
		self.marketTraderTradeReport = {};
		
		var d = new Date();
		console.log("Time of trade: " + d);
		//annouce who is buy and selling stock for each stock
		var pairedUpTraders = pairInput;
		console.log(pairedUpTraders[0].name + " is buying and " + pairedUpTraders[1].name + " is selling");

		//determent spread on the trade 
		var marketPrice = parseFloat(stockPriceInput);
		console.log(pairedUpTraders[0].name + " " + pairedUpTraders[0].stockinterest + " offer price is " + pairedUpTraders[0].offerPrice);
		console.log(pairedUpTraders[1].name + " " + pairedUpTraders[1].stockinterest + " offer price is " + pairedUpTraders[1].offerPrice);
		var spread = (pairedUpTraders[0].offerPrice - pairedUpTraders[1].offerPrice);
		console.log("Current spread on trade :$" + spread);

		//determent who the trade favors
		var settleUptonPrice = null;
		// buyer wants it more, seller advantage
		if (pairedUpTraders[0].urgency > pairedUpTraders[1].urgency) {
			settleUptonPrice = marketPrice + spread;
			console.log("settled price " + settleUptonPrice + " " + pairedUpTraders[1].name + " advantage.")
		// seller wants it more, buyer advantage
		}else if (pairedUpTraders[1].urgency > pairedUpTraders[0].urgency) {
			settleUptonPrice = marketPrice - spread;
			console.log("settled price " + settleUptonPrice + " " + pairedUpTraders[0].name + " advantage.")
		// importance is matching no advantage
		}else{
			settleUptonPrice = marketPrice;
			console.log("settled price " + settleUptonPrice + " even trade.")
		};

		// money change hands
		pairedUpTraders[0].balance = parseFloat(pairedUpTraders[0].balance) - parseFloat(settleUptonPrice);
		pairedUpTraders[1].balance = parseFloat(pairedUpTraders[1].balance) + parseFloat(settleUptonPrice);
		if (pairedUpTraders[0].balance == NaN || pairedUpTraders[0].balance < 1) {
			pairedUpTraders[0].balance = 0;
		};
		if (pairedUpTraders[1].balance == NaN || pairedUpTraders[1].balance < 1) {
			pairedUpTraders[1].balance = 0;
		};
		// stock change hands
		pairedUpTraders[0].quantity = pairedUpTraders[0].quantity + 1;
		pairedUpTraders[1].quantity = pairedUpTraders[1].quantity - 1;
		//console.log(pairedUpTraders[0].quantity + " <<<<<<<<<<");
		//console.log(pairedUpTraders[1].quantity + " <<<<<<<<<<");
		
		// sit bots after trading
		pairedUpTraders[0].chill();
		pairedUpTraders[1].chill();
		
		// new stock trade and price
		var newPrice = (pairedUpTraders[0].offerPrice + pairedUpTraders[1].offerPrice) / 2;
		pairedUpTraders[0].reprice();
		pairedUpTraders[1].reprice();

		self.marketTraderTradeReport['time'] = d;
		self.marketTraderTradeReport['trade_string'] = pairedUpTraders[0].name + " is buying and " + pairedUpTraders[1].name + " is selling";
		self.marketTraderTradeReport['spread'] =  spread;
		self.marketTraderTradeReport['stock_name'] = stockName;
		self.marketTraderTradeReport['stock_price'] = newPrice;
		
		return newPrice;	
	};
	this.sweep = function () {
		// clear the trade floor for future trades
		console.log("Okay, deals done, clear the floor, come back later...");
		self.stockOfInterestName = [];
		self.stockOfInterestPrice = [];
		self.trendValue = null;
		self.botsInterestedInTrading = [];
		self.marketTraderWrap++;
	};
	// starts the listensers on market maker
	this.service = function (watchedObj) {

		// listen to see any change happenes to twitterTrend
		Object.observe(watchedObj, function(changes) {
			//[ { symbol: '$goog', count: 1, attitude: 3, change: 3, pchange: 3 } ]
			console.log("The following marketMaker saw a change in twitter stream.")
			var twitterUpdates = changes[0].object.API;

			// reports current market state at start of twitter update
			console.log("There are " + (self.marketStockListing.length)  + " stocks in db.");

			// let market maker bot know watsup
			self.discover(twitterUpdates); 

			//report stock names and prices 
			self.yell('start');

			//pass data to bots
			self.pass();

			//set the stage for bots wanting to trade
			self.stage();
			
			//clean up after all trade
			self.sweep();
		});
	};
	/*
	// watch to see any change happenes to stock market price, set off more trade based on that
	Object.observe(self, function(changes) {
		console.log("Stock market price has changed...to" + changes.object.marketMakersPrice);
	});	
	*/
};

module.exports = MarketMaker;