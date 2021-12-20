import axios from "axios";

const cache: { [key: string]: number | number[] } = {};

const last10days = () => {
    const thedays: string[] = []
    const date = new Date()
    for (let i = 0; i < 10; i++) {
        thedays.push(`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`)
        date.setDate(date.getDate() - 1)
    }
    return thedays
}

export const loadTokenPrices = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,olympus,wonderland,magic-internet-money&vs_currencies=usd";
    const { data } = await axios.get(url);

    if (!cache['TIME_HISTORY']) cache['TIME_HISTORY'] = [data.wonderland.usd]
    console.log('starting', cache['TIME_HISTORY'])
    for (const date of last10days()) {
        console.log('for date', date)
        const url2 = `https://api.coingecko.com/api/v3/coins/wonderland/history?date=${date}`;
        const { data: timeData } = await axios.get(url2);
        console.log('data is', timeData);
        (cache['TIME_HISTORY'] as number[]).push(timeData.market_data.current_price.usd)
    }
    cache['TIME_HISTORY'] = (cache['TIME_HISTORY'] as number[]).reverse()
    console.log('cahce is', cache['TIME_HISTORY'])

    cache["AVAX"] = data["avalanche-2"].usd;
    cache["MIM"] = data["magic-internet-money"].usd;
};

export const getTokenPrice = (symbol: string): any => {
    return Array.isArray(cache[symbol]) ? cache[symbol] : Number(cache[symbol]);
};
