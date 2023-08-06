import { fetchSecurityData } from "./api.js";
import {
  addRealQuote,
  getFirstRealQuote,
  getRealQuotes,
  updateRealQuote,
} from "./db.js";

//todo 读行情表，逐一更新
function updateRealQuotes() {
  getRealQuotes().then(function (realQuotes) {
    for (let realQuote of realQuotes) {
      const quote = fetchSecurityData(realQuote.code);
      updateRealQuote(realQuote.id, quote);
    }
  });
}

// 每15秒调用updateRealPrices来更新securitiesMap
setInterval(updateRealQuotes, 15000);

// 从db里拿行情，如果没有就写进db
export async function getRealQuote(code) {
  const realQuote = await getFirstRealQuote(code);
  if (!realQuote) {
    const securityData = await fetchSecurityData(code);
    const quote = {
      code: code,
      name: securityData.name,
      realPrice: securityData.realPrice,
    };
    // console.log(quote);
    addRealQuote(quote);
    return quote;
  }
  return realQuote;
}
