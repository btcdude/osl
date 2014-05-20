var querystring = require("querystring"),
  crypto = require("crypto"),
  request = require("request"),
  JSONStream = require("JSONStream");

function ANXClient(key, secret, currency,server) {
  var self = this;
  self.key = key;
  self.secret = secret;
  self._currency = currency || "BTCUSD";
  self._server = server || "https://anxpro.com";

  var SATOSHI_FACTOR = Math.pow(10,8);

  function makePublicRequest(path, args, callback,version) {
    version = typeof version !== 'undefined' ? version : '2';
    var params = querystring.stringify(args);
    if (params) path = path + "?" + params;
    return executeRequest(basicOptions(version,path), callback);
  }

  function makeRequest(path, args, callback,version) {
    version = typeof version !== 'undefined' ? version : '2';
    if (!self.key || !self.secret) {
      throw new Error("Must provide key and secret to make this API request.");
    }

    // generate a tonce (tonce used instead of nonce as tonce doesn't have to ever increase, which helps avoid race conditions due to nodes unpredictable order of operations
    args.tonce = (new Date()).getTime() * 1000;
    // compute the post data
    var postData = null;
    if (version==3) {
        postData = JSON.stringify(args)
    } else {
        postData = querystring.stringify(args);
    }

    // append the path to the post data
    var message = path + "\0" + postData;
    if(version==3) { //ANX version 3 expects the full path
        message="api/3/"+message;
    }
    // compute the sha512 signature of the message
    var hmac = crypto.createHmac("sha512", new Buffer(self.secret, "base64"));
    hmac.update(message);

    var options = basicOptions(version,path);

    options.method = "POST";
    options.body = postData;
    options.headers["Rest-Key"] = self.key;
    options.headers["Rest-Sign"] = hmac.digest("base64");
    options.headers["Content-Length"] = postData.length;

    return executeRequest(options, callback);
  }

  function executeRequest(options, callback) {
    if (typeof callback == "function") {
      request(options, function (err, res, body) {
        var json;
      
        if (err  || !res || res.statusCode != 200) {
          var statusCode = res?res.statusCode:null;
          return callback({error:(err || new Error("Request failed")),statusCode:statusCode});
        }

        // This try-catch handles cases where Mt.Gox returns 200 but responds with HTML,
        // causing the JSON.parse to throw
	// shouldn't happen with ANX but left here for now.
        try {
            json = JSON.parse(body);
        } catch(err) {
          if (body.indexOf("<") != -1) {
            return callback({error:new Error("ANX responded with html:\n" + body)});
          } else {
            return callback({error:new Error("JSON parse error: " + err)});
          }
        }
        
        callback(null, json);
      });
    } else {
      var parser = JSONStream.parse(["data", true]);
      request.get(options).pipe(parser);
      return parser;
    }
  }

  function basicOptions(version,path) {
    return {
      uri: self._server+"/api/"+version+"/" + path,
      agent: false,
      headers: {
        "User-Agent": "Mozilla/4.0 (compatible; ANX node.js client)",
        "Content-type": "application/x-www-form-urlencoded"
      }
    };
  }

  self.setCurrency = function(currency) {
    self._currency = currency;
  };

  self.info = function(callback) {
    makeRequest(self._currency + "/money/info", {}, callback);
  };

  self.idKey = function(callback) {
    makeRequest(self._currency + "/money/idkey", {}, callback);
  };

  self.orders = function(callback) {
    makeRequest(self._currency + "/money/orders", {}, callback);
  };

  self.currency = function(callback) {
    makePublicRequest(self._currency + "/money/currency", {}, callback);
  };

  self.ticker = function(callback) {
    makePublicRequest(self._currency + "/money/ticker", {}, callback);
  };

  self.tickerFast = function(callback) {
    makePublicRequest(self._currency + "/money/ticker_fast", {}, callback);
  };

  self.quote = function(type, amount, callback) {
    makeRequest(self._currency + "/money/order/quote", {
      "type": type,
      "amount": amount
    }, callback);
  };

  // price is an optional argument, if not used it must be set to null
  self.add = function(type, amount, price, callback) {
    var args = {
      "type": type,
      "amount": amount
    };
    if (price) args.price = price;
    makeRequest(self._currency + "/money/order/add", args, callback);
  };

  self.cancel = function(id, callback) {
    makeRequest(self._currency + "/money/order/cancel", {
      "oid": id
    }, callback);
  };

  // not currently implemented
  self.result = function(type, order, callback) {
    makeRequest(self._currency + "/money/order/result", {
      "type": type,
      "order": order
    }, callback);
  };

  self.lag = function(callback) {
    makePublicRequest(self._currency + "/money/order/lag", {}, callback);
  };

  self.fetchTrades = function(since, callback) {
    var args = {};
    if (typeof since != undefined) args.since = since;
    return makePublicRequest(self._currency + "/money/trades/fetch", args, callback);
  };

  self.fetchDepth = function(callback) {
    makePublicRequest(self._currency + "/money/depth/fetch", {}, callback);
  };

  self.fullDepth = function(callback) {
    makePublicRequest(self._currency + "/money/depth/full", {}, callback);
  };

  // page is an optional argument, if not used it must be set to null
  self.history = function(currency, page, callback) {
    var args = { "currency": currency };
    if (page) args.page = page;
    makeRequest("money/wallet/history", args, callback);
  };

    // old gox method, better to use generic one below that also supports otp
  self.sendBitcoin = function(address, amount, fee, callback) {
    var amountInt = amount * SATOSHI_FACTOR;
    var feeInt = fee * SATOSHI_FACTOR;
    var args = { address: address, amount_int: amountInt, fee_int: feeInt };
    makeRequest("money/bitcoin/send_simple", args, callback);
  };

  self.send = function(ccy, address, amount, otp, callback) {
      var args = {address:address,ccy:ccy,amount:amount,otp:otp}
      makeRequest("money/bitcoin/send_simple", args, callback);
  };

  self.depositAddress = function(callback) {
    self.info(function(err, json) {
      if (err) return callback(err);
      if (json.result !== "success") {
        var error = new Error("Unexpected response while retrieving account number: " + json.result);
        return callback(error);
      }
      var args = { "account": json.data.Link };
      makeRequest(self._currency + "/money/bitcoin/get_address", args, callback);
    });
  }

  self.dataToken= function(callback) {
    makeRequest("dataToken", {}, callback,3);
  };

  self.currencyStatic = function(callback) {
      makePublicRequest("currencyStatic",{},callback,3);
  }

  self.merchantQuoteRequest = function(tradedCcy,settlementCcy,settlementAmount,side,customRef,callback) {
    makeRequest("merchant/quote/new", {tradedCurrency:tradedCcy,settlementCurrency:settlementCcy,settlementCurrencyAmount:settlementAmount,side:side,customRef:customRef}, callback,3);
  };

  self.merchantTradeRequest = function(quoteId,callback) {
    makeRequest("merchant/trade/new", {quoteId:quoteId}, callback,3);
  };

  self.merchantTradeRequestList = function(quoteId,callback) {
    makeRequest("merchant/trade/list", {quoteId:quoteId}, callback,3); 
  };

  self.createSubAccount= function(ccy,customRef,callback) {
        makeRequest("subaccount/new", {ccy:ccy,customRef:customRef}, callback,3);
  };

  self.accountAddress= function(ccy,subAccount,callback) {
        makeRequest("receive", {ccy:ccy,subAccount:subAccount}, callback,3);
  };

  self.newAccountAddress= function(ccy,subAccount,callback) {
       makeRequest("receive/create", {ccy:ccy,subAccount:subAccount}, callback,3);
  };
  self.tradeHistory= function(max,offset,callback) {
       makeRequest("trade/list", {max:max,offset:offset}, callback,3);
  };

}

module.exports = ANXClient;
