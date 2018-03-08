import React from 'react';
import FA from 'react-fontawesome';
import { render } from 'react-dom';
import Chart from './Chart';
import { getInitialData } from "./utils"

// scale charts page to only be a part of the full window, 1 means no scaling
const heightFactor = 1
const widthFactor = 1
const maxCandles = 60

class ChartComponent extends React.Component {
	// handles window size changes
	updateDimensions() {
		// calculate a width and height for the charts page
		const height = window.innerHeight*heightFactor
		const width = window.innerWidth*widthFactor
		// save the w and h to state
		this.setState({ height, width });
	}
	componentWillUnmount() {
		// remove the listener that handles window size changes
		window.removeEventListener("resize", this.updateDimensions.bind(this));
	}
	componentDidMount() {
		// update the charts for the 1st time
		this.updateDimensions();
		// enable window size changes to redraw the charts
		window.addEventListener("resize", this.updateDimensions.bind(this));
		// loads initial candle data from gdax over a simple GET API 
		getInitialData({getState: ()=>this.state, stateUpdate: this.setState.bind(this)})
	}
	render() {
		if (this.state == null) {
			return <FA name="cog" spin size='5x' />
		}

		return <div>
			<div className='panes'>
	{this.state.a?
				<Chart 
					type='hybrid'
					data={this.state.a} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={maxCandles}
					volumeProfileBins={24}
				/> : <span><FA name="cog" spin size='5x' /> 1min candles</span>}
	{this.state.b?
				<Chart 
					type='hybrid'
					data={this.state.b} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={maxCandles}
					volumeProfileBins={24}
				/>: <span><FA name="cog" spin size='5x' /> 5min candles</span>}
			</div>
			<div className='panes'>
	{this.state.c?
				<Chart 
					type='hybrid'
					data={this.state.c} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={maxCandles}
					volumeProfileBins={24}
				/>: <span><FA name="cog" spin size='5x' /> 15min candles</span>}
	{this.state.d?
				<Chart 
					type='hybrid'
					data={this.state.d} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={maxCandles}
					volumeProfileBins={24}
				/>: <span><FA name="cog" spin size='5x' /> 1hr candles</span>}
			</div>
		</div>
	}
}

render(
	<ChartComponent />,
	document.getElementById("root")
);
