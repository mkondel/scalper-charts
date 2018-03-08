window.ws = new WebSocket("wss://ws-feed.gdax.com");
var params = {"type": "subscribe","channels": [{"name": "matches","product_ids": ["BTC-USD",]}]}
window.ws.onopen = () => window.ws.send(JSON.stringify(params))

export const getInitialData = ({getState, stateUpdate}) =>
	getData(60).then(a => stateUpdate({ a }, ()=>
		getData(60*60).then(b => stateUpdate({ b }, ()=>
			getData(60*15).then(c => stateUpdate({ c }, ()=>
				getData(60*60*24).then(d => stateUpdate({ d }, ()=> {
						console.log('initial data loaded')
						enableLiveUpdates({getState, stateUpdate})
					}
				))
			))
		))
	))


const enableLiveUpdates = ({getState, stateUpdate}) => {
	const addTrade = ({price, date, size}) => {
		console.log(`i am the trade `);
		// console.log(`i am the trade ${price} ${side} ${size}`)
		['a','b','c','d'].map(pane => {
			const state = getState()
			const chart = state[pane]
			const first = chart[0]
			const last = chart[chart.length-1]
			// console.log(`${pane} ${first.date} ${last.date}`)

			
			last.close = price
			last.volume += size
			// console.log(`${pane} ${last.close} ${last.volume}`)
			chart[chart.length-1] = last
			stateUpdate({[pane]: chart})
		})
	}
	window.ws.onmessage = (msg) => {
		var data = JSON.parse(msg.data);
		const product = data.product_id;
		const price = parseFloat(data.price)
		const date = data.date
		const size = parseFloat(data.size)
		const usd = price * size
		switch(data.type) {
			case 'match':
				switch(product) {
					case 'BTC-USD':
						// console.log(`${price} ${side} ${size} $${usd}`)
						addTrade({price, date, size})
						break;
				}
				break;
			case 'last_match':
				console.log(`handle last match to set the last candle... ${price} ${date} ${data.size} $${usd}`)
				break;
		}
	}
}

const getData = span => getHistoricalCandles(span, 'BTC-USD')

// pulls historical candles form GDAX for a given granularity
function getHistoricalCandles(granularity, product){
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

