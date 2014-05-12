#ANX API v2 Node Client

#WARNING halfway through changing the api to use value rather than value_int types, examine the code before using in production.

ANX implemented a MTGOX v2 compatible implementation for their polling API. This is a fork of https://github.com/ameensol/node-mtgox-apiv2

To use this, you must have created an API Key on their [website](https://anxpro.com).

Please be careful to understand amounts and rates - due to the MTGOX API legacy, prices and amounts are specified as integers.

FIAT amounts are specified with integers to the power of 5.

For example 100000 USD is equivalent to 1 USD.

Crypto amounts are specified in satoshi's - to the power of 8, so:
100000000 LTC is 1 LTC.

Rates depend on the currency pair - in general LTC and BTC prices are specified to 5 decimal places, and NMC/DOGE/PPC to 8 decimal places.

Consult http://docs.anxv2.apiary.io/ for details, and for the amount of decimal places on a currency pair price, you can see
https://anxpro.com/api/3/currencyStatic

#Credits

Ameen Soleimani for his MTGOX implementation at - https://github.com/ameensol/node-mtgox-apiv2


