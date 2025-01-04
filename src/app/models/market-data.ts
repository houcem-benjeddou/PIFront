export class MarketData {
    assetName: string;
    openingPrice: number;
    closingPrice: number;
    currentPrice: number;
    highPrice: number;
    lowPrice: number;
    date: Date;
  
    constructor(
      assetName: string,
      openingPrice: number,
      closingPrice: number,
      currentPrice: number,
      highPrice: number,
      lowPrice: number,
      date: Date
    ) {
      this.assetName = assetName;
      this.openingPrice = openingPrice;
      this.closingPrice = closingPrice;
      this.currentPrice = currentPrice;
      this.highPrice = highPrice;
      this.lowPrice = lowPrice;
      this.date = date;
    }
  }
  