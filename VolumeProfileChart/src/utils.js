

import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

export function getData() {

	// return getHistoricalCandles(60*60*24, 'BTC-USD')
	// return getHistoricalCandles(60*60, 'BTC-USD')
	// return getHistoricalCandles(60*15, 'BTC-USD')
	// return getHistoricalCandles(60*5, 'BTC-USD')
	return getHistoricalCandles(60, 'BTC-USD')

	// const promiseMSFT = fetch("//rrag.github.io/react-stockcharts/data/MSFT.tsv")
	// 	.then(response => response.text())
	// 	.then(data => tsvParse(data, parseData(parseDate)))
	// return promiseMSFT;
}


// this is for parsing candle data from GDAX
const parseDataArray = ({candle, product}) => ({
	date: new Date(candle[0]*1000),
	open: candle[3],
	high: candle[2],
	low: candle[1],
	close: candle[4],
	volume: candle[5],
	split: null,
	dividend: null,
	product,
})
// pulls historical candles form GDAX for a given granularity
export function getHistoricalCandles(granularity, product){
	const url = `https://api.gdax.com/products/${product}/candles?granularity=${granularity}`;
	// const url = '//rrag.github.io/react-stockcharts/data/MSFT.tsv'
	console.log(new Date(), url)
	// return Promise.resolve([1,2,3,4,5])
	return fetch(url)
	.then(res=>res.json())
	.then(json=>{
		if(json && json[0] && json[0][0]){
			// const lastDate = new Date(json[0][0]*1000)
			// const firstDate = new Date(json[json.length-1][0]*1000)
			// console.log(firstDate, lastDate)
			return json
		}
	})
	.then(candles=>candles ? candles.reverse().map(candle=>parseDataArray({candle, product})) : null)
}