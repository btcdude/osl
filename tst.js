var ANXClient = require("./index");

var key = "fd012755-ed0a-4740-ab16-f8dda02913a7";
var secret = "HpicWK9k/425hqLUF/kluflK5N9rME4xVYYlM7Ux/uJ7UZa1PV1iyeEFovKg6hl/Q59/j00+Fewl0xQMlCh85A==";

var client = new ANXClient(key,secret,"BTCUSD","https://test.anxpro.com");
//
//client.dataToken(function(err, json) {
//    if (err) { throw err; }
//    console.log("---------------Client Info:--------------");
//    console.log(json);
//});
//
//client.info(function(err, json) {
//    if (err) { throw err; }
//    console.log("---------------Client Info:--------------");
//    console.log(json);
//});


//client.quote("ask", 100000000, function(err, json) {
//    if (err) { throw err; }
//    console.log("---------------Quote:--------------");
//    console.log(json);
//});

//client.add("bid", "10000000", "40000000", function(err, json) {
//     if (err) { throw err; }
//     console.log("---------------Add:--------------");
//     console.log(json);
//     var oid = json.data;
////     client.cancel(oid,function(err, json) {
////         console.log("---------------Cancel:--------------");
////         console.log(json);
////     });
//
//});
//
client.orders(function(err, json) {
    if (err) { throw JSON.stringify(err,null,3); }
    console.log("---------------Orders:--------------");
    console.log(JSON.stringify(json,null,3));
});

//client.currencyStatic(function(err, json) {
//    if (err) { throw err; }
//    console.log("---------------CurrencyStatic:--------------");
//    console.log(json);
//});

client.ticker(function(err, json) {
    if (err) { throw JSON.stringify(err,null,3); }
    console.log("---------------CurrencyStatic:--------------");
    console.log(JSON.stringify(json,null,3));
});
