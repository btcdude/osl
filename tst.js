var ANXClient = require("./index");

var client = new ANXClient("89b5784c-b6ef-4bc6-bb69-261a2c840ed7","kfz939Io9FqJ5Czu1GSrSSRxkAPjl3Aj3aKctekZ3V9Ec77LGyvMUvz/Dh8wOVf7CZuH2zsaxAkz7TlZT6D8zg==");

client.dataToken(function(err, json) {
    if (err) { throw err; }
    console.log("---------------Client Info:--------------");
    console.log(json);
});


//client.quote("ask", 100000000, function(err, json) {
//    if (err) { throw err; }
//    console.log("---------------Quote:--------------");
//    console.log(json);
//});