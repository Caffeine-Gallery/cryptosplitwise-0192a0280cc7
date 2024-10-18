import Func "mo:base/Func";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

actor CryptoPortfolio {
  // Simulated top 20 cryptocurrencies with their market caps (in billions)
  let topCryptos : [(Text, Float)] = [
    ("Bitcoin", 1000.0),
    ("Ethereum", 500.0),
    ("Binance Coin", 100.0),
    ("Cardano", 80.0),
    ("Solana", 70.0),
    ("XRP", 60.0),
    ("Polkadot", 50.0),
    ("Dogecoin", 40.0),
    ("Avalanche", 35.0),
    ("TRON", 30.0),
    ("Chainlink", 25.0),
    ("Litecoin", 20.0),
    ("Uniswap", 18.0),
    ("Polygon", 16.0),
    ("Stellar", 14.0),
    ("Monero", 12.0),
    ("Algorand", 10.0),
    ("VeChain", 8.0),
    ("Tezos", 6.0),
    ("EOS", 4.0)
  ];

  // Function to calculate total market cap
  func calculateTotalMarketCap() : Float {
    var total : Float = 0;
    for ((_, marketCap) in topCryptos.vals()) {
      total += marketCap;
    };
    total
  };

  // Function to calculate allocation based on market cap
  public func calculateAllocation(investmentAmount : Float) : async [(Text, Float)] {
    let totalMarketCap = calculateTotalMarketCap();
    
    let allocations = Array.map<(Text, Float), (Text, Float)>(topCryptos, func((crypto, marketCap)) {
      let allocation = (marketCap / totalMarketCap) * investmentAmount;
      (crypto, allocation)
    });

    allocations
  };
}
