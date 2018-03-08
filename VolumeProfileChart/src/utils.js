window.ws = new WebSocket("wss://ws-feed.gdax.com");
var params = {"type": "subscribe","channels": [{"name": "matches","product_ids": ["BTC-USD",]}]}
window.ws.onopen = () => window.ws.send(JSON.stringify(params))

export function getData(span=60) {
	// return getHistoricalCandles(60*60*24, 'BTC-USD')
	// return getHistoricalCandles(60*60, 'BTC-USD')
	// return getHistoricalCandles(60*15, 'BTC-USD')
	// return getHistoricalCandles(60*5, 'BTC-USD')
	// console.log(`span is ${span}`)
	return getHistoricalCandles(span, 'BTC-USD')
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

window.ws.onmessage = (msg) => {
	var data = JSON.parse(msg.data);
	const product = data.product_id;
	const price = data.price
	const side = data.side
	const size = data.size
	const usd = price * size
	switch(data.type) {
		case 'match':
			switch(product) {
				case 'BTC-USD':
					console.log(`${price} ${side} ${data.size} $${usd}`)
					break;
			}
			break;
		case 'last_match':
			console.log(`handle last match to set the last candle... ${price} ${side} ${data.size} $${usd}`)
			break;
	}
}
