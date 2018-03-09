window.ws = new WebSocket("wss://ws-feed.gdax.com");
var params = {"type": "subscribe","channels": [{"name": "matches","product_ids": ["BTC-USD",]}]}
window.ws.onopen = () => window.ws.send(JSON.stringify(params))

export const getInitialData = ({getState, stateUpdate, done}) =>{
	const state = getState()
	const possible = state.possibleIntervals
	const chartLabels = state.chartLabels

	getData(possible[chartLabels.a]).then(a => {
		console.log(`${chartLabels.a} loaded`)
		getData(possible[chartLabels.b]).then(b => {
			console.log(`${chartLabels.b} loaded`)
			getData(possible[chartLabels.c]).then(c => {
				console.log(`${chartLabels.c} loaded`)
				getData(possible[chartLabels.d]).then(d => {
					console.log(`${chartLabels.d} loaded`)
					stateUpdate({ a,b,c,d }, () => {
						console.log('initial data loaded');
						console.dir(d)
						done(enableLiveUpdates);
					})
				})
			})
		})
	})
}


const enableLiveUpdates = ({getState, stateUpdate}) => {
	const chartUpdateInterval = 500
	const state = getState()
	delete state.showModal
	delete state.showCharts
	delete state.cog
	//put on  a timer
	setInterval(
		()=>{
			// get the latest window size
			const stateNow = getState()
			Object.assign(stateNow, state)
			stateUpdate(stateNow)
			return null;
		}, 
		chartUpdateInterval
	)
	const addTrade = ({price, date, size}) => {
		const possible = state.possibleIntervals;
		const chartLabels = state.chartLabels;

		[	{pane:'a',interval: possible[chartLabels.a]},
			{pane:'b',interval: possible[chartLabels.b]},
			{pane:'c',interval: possible[chartLabels.c]},
			{pane:'d',interval: possible[chartLabels.d]}
		].map(({pane, interval}) => {
			const chart = state[pane]
			if(chart){
				let last = chart[chart.length-1]
				// new candle
				if(new Date() - last.date > interval*1000){
					// add a new candle to the chart
					chart.push({
						date: new Date(last.date.getTime() + interval*1000),
						open: price,
						high: price,
						low: price,
						close: price,
						volume: 0,
					})
					last = chart[chart.length-1]
				}
				
				last.close = price
				last.volume += size
				// console.log(`${pane} ${last.close} ${last.volume}`)
				chart[chart.length-1] = last
				state[pane] = chart
			}
			return null;
		})
		return null;
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
					default:
						break;
				}
				break;
			case 'last_match':
				console.log(`handle last match to set the last candle... ${price} ${date} ${data.size} $${usd}`)
				break;
			default:
				break;
		}
		return null;
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

