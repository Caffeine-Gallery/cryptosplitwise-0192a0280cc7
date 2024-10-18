import Int "mo:base/Int";

import Array "mo:base/Array";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor CryptoPortfolio {
  type CryptoData = {
    symbol: Text;
    marketCap: Float;
  };

  private var cryptoCache : [CryptoData] = [];
  private var lastFetchTime : Int = 0;
  private let cacheValidityPeriod : Int = 5 * 60 * 1000_000_000; // 5 minutes in nanoseconds

  // Updated simulated cryptocurrency data based on current top 20 from CoinMarketCap
  private func simulateCryptoData() : [CryptoData] {
    [
      { symbol = "BTC"; marketCap = 1000000000000.0 },
      { symbol = "ETH"; marketCap = 500000000000.0 },
      { symbol = "USDT"; marketCap = 80000000000.0 },
      { symbol = "BNB"; marketCap = 70000000000.0 },
      { symbol = "USDC"; marketCap = 60000000000.0 },
      { symbol = "XRP"; marketCap = 50000000000.0 },
      { symbol = "SOL"; marketCap = 45000000000.0 },
      { symbol = "ADA"; marketCap = 40000000000.0 },
      { symbol = "DOGE"; marketCap = 35000000000.0 },
      { symbol = "TRX"; marketCap = 30000000000.0 },
      { symbol = "TON"; marketCap = 28000000000.0 },
      { symbol = "LINK"; marketCap = 26000000000.0 },
      { symbol = "MATIC"; marketCap = 24000000000.0 },
      { symbol = "DOT"; marketCap = 22000000000.0 },
      { symbol = "WBTC"; marketCap = 20000000000.0 },
      { symbol = "DAI"; marketCap = 18000000000.0 },
      { symbol = "LTC"; marketCap = 16000000000.0 },
      { symbol = "BCH"; marketCap = 14000000000.0 },
      { symbol = "SHIB"; marketCap = 12000000000.0 },
      { symbol = "AVAX"; marketCap = 10000000000.0 }
    ]
  };

  private func getCachedOrFetchCryptoData() : [CryptoData] {
    let currentTime = Time.now();
    if (cryptoCache.size() == 0 or (currentTime - lastFetchTime) > cacheValidityPeriod) {
      cryptoCache := simulateCryptoData();
      lastFetchTime := currentTime;
    };
    cryptoCache
  };

  public func calculateAllocation(investmentAmount : Float) : async [(Text, Float)] {
    let cryptoData = getCachedOrFetchCryptoData();
    
    let totalMarketCap = Array.foldLeft<CryptoData, Float>(cryptoData, 0, func (acc, crypto) {
      acc + crypto.marketCap
    });
    
    Array.map<CryptoData, (Text, Float)>(cryptoData, func(crypto) {
      let allocation = (crypto.marketCap / totalMarketCap) * investmentAmount;
      (crypto.symbol, allocation)
    })
  };
}
