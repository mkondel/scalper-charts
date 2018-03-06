
import React from 'react';
import FA from 'react-fontawesome';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from "./utils"

const heightFactor = 1
const widthFactor = 1

class ChartComponent extends React.Component {
	updateDimensions() {
		const height = window.innerHeight*heightFactor
		const width = window.innerWidth*widthFactor
		this.setState({ height, width });
	}
	componentDidMount() {
		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions.bind(this));

		getData(60).then(a => {
			console.log('loaded 1min candles')
			this.setState({ a }, ()=>{
				getData(60*60).then(b => {
					console.log('loaded 1hr candles')
					this.setState({ b }, ()=>{
						getData(60*15).then(c => {
							console.log('loaded 15min candles')
							this.setState({ c }, ()=>{
								getData(60*60*24).then(d => {
									console.log('loaded 1day candles')
									this.setState({ d })
								})
							})
						})
					})
				})
			})
		})
	}
	 componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions.bind(this));
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
					maxCandles={100}
					volumeProfileBins={24}
				/> : <span><FA name="cog" spin size='5x' /> 1min candles</span>}
	{this.state.b?
				<Chart 
					type='hybrid'
					data={this.state.b} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={100}
					volumeProfileBins={24}
				/>: <span><FA name="cog" spin size='5x' /> 15min candles</span>}
			</div>
			<div className='panes'>
	{this.state.c?
				<Chart 
					type='hybrid'
					data={this.state.c} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={100}
					volumeProfileBins={24}
				/>: <span><FA name="cog" spin size='5x' /> 1hr candles</span>}
	{this.state.d?
				<Chart 
					type='hybrid'
					data={this.state.d} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={100}
					volumeProfileBins={24}
				/>: <span><FA name="cog" spin size='5x' /> 1day candles</span>}
			</div>
		</div>
	}
}

render(
	<ChartComponent />,
	document.getElementById("root")
);
