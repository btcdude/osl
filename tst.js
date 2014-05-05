var ANXClient = require("./index");

var client = new ANXClient("4240330b-ef4a-49e5-9e48-c122c1de8cac","1WgxyGmfeTNLewSz+9nmERefnoNVRBMa3kc5AeSI4pz48s+2R+HPE4as/LztGVVvMKf6jg2KOPyaGWUkkJygIw==");
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
    if (err) { throw err; }
    console.log("---------------Orders:--------------");
    console.log(json);
});

//client.currencyStatic(function(err, json) {
//    if (err) { throw err; }
//    console.log("---------------CurrencyStatic:--------------");
//    console.log(json);
//});

client.ticker(function(err, json) {
    if (err) { throw err; }
    console.log("---------------CurrencyStatic:--------------");
    console.log(json);
});