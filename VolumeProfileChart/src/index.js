import React from 'react';
import FA from 'react-fontawesome';
import { render } from 'react-dom';
import Chart from './Chart';
import { getInitialData } from "./utils"
import ReactModal from 'react-modal';

// scale charts page to only be a part of the full window, 1 means no scaling
const heightFactor = 1
const widthFactor = 1


class ChartComponent extends React.Component {
    constructor(){
        super()
        this.state = {
            possibleIntervals: {
                '1min': 60,
                '5min': 60*5,
                '15min': 60*15,
                '1hr': 60*60,
                '4hr': 60*60*4,
                '1day': 60*60*24,
            },
            chartLabels: {
                'a': '1min',
                'b': '5min',
                'c': '15min',
                'd': '1hr',
            },
            volumeProfileBins: {
                'a': 24,
                'b': 24,
                'c': 24,
                'd': 24,
            },
            maxCandles: {
                'a': 60,
                'b': 60,
                'c': 60,
                'd': 60,
            },
            showModal: false
        };
    
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    handleOpenModal () {
    	console.log(`opening modal`);
        this.setState({ showModal: true });
    }

    handleCloseModal () {
    	console.log(`closing modal`);
        this.setState({ showModal: false });
    }
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
        // loads initial candle data from gdax over a simple GET API 
        getInitialData({getState: this.getState.bind(this), stateUpdate: this.setState.bind(this), done: ()=>{
	        // update the charts for the 1st time
	        this.updateDimensions();
	        // enable window size changes to redraw the charts
	        window.addEventListener("resize", this.updateDimensions.bind(this));
        }})
    }
    getState(){
    	return this.state;
    }
    render() {
        if (this.state == null) {
            return <FA name="cog" spin size='5x' />
        }

        return <div>
			<button onClick={this.handleOpenModal}>Trigger Modal</button>
			<ReactModal 
				isOpen={this.state.showModal}
				contentLabel="onRequestClose Example"
				onRequestClose={this.handleCloseModal}
				className="Modal"
				overlayClassName="Overlay"
				ariaHideApp={false}
			>
				<p>Modal text!</p>
				<button onClick={this.handleCloseModal}>Close Modal</button>
			</ReactModal>
            <div className='panes'>
    {this.state.a?
                <Chart 
                    type='hybrid'
                    data={this.state.a} 
                    height={this.state.height/2}
                    width={this.state.width/2}
                    maxCandles={this.state.maxCandles.a}
                    volumeProfileBins={this.state.volumeProfileBins.a}
                    chartLabel={this.state.chartLabels.a}
                    leftClick={()=>this.leftClick.bind(this)}
                    rightClick={()=>this.rightClick.bind(this)}
                    doubleClick={()=>this.doubleClick.bind(this)}
                    candleSize={this.state.possibleIntervals[this.state.chartLabels.a]}
                /> : <span><FA name="cog" spin size='5x' /> {this.state.chartLabels.a} candles</span>}
    {this.state.b?
                <Chart 
                    type='hybrid'
                    data={this.state.b} 
                    height={this.state.height/2}
                    width={this.state.width/2}
                    maxCandles={this.state.maxCandles.b}
                    volumeProfileBins={this.state.volumeProfileBins.b}
                    chartLabel={this.state.chartLabels.b}
                    leftClick={()=>this.leftClick.bind(this)}
                    rightClick={()=>this.rightClick.bind(this)}
                    doubleClick={()=>this.doubleClick.bind(this)}
                    candleSize={this.state.possibleIntervals[this.state.chartLabels.b]}
                />: <span><FA name="cog" spin size='5x' /> {this.state.chartLabels.b} candles</span>}
            </div>
            <div className='panes'>
    {this.state.c?
                <Chart 
                    type='hybrid'
                    data={this.state.c} 
                    height={this.state.height/2}
                    width={this.state.width/2}
                    maxCandles={this.state.maxCandles.c}
                    volumeProfileBins={this.state.volumeProfileBins.c}
                    chartLabel={this.state.chartLabels.c}
                    leftClick={()=>this.leftClick.bind(this)}
                    rightClick={()=>this.rightClick.bind(this)}
                    doubleClick={()=>this.doubleClick.bind(this)}
                    candleSize={this.state.possibleIntervals[this.state.chartLabels.c]}
                />: <span><FA name="cog" spin size='5x' /> {this.state.chartLabels.c} candles</span>}
    {this.state.d?
                <Chart 
                    type='hybrid'
                    data={this.state.d} 
                    height={this.state.height/2}
                    width={this.state.width/2}
                    maxCandles={this.state.maxCandles.d}
                    volumeProfileBins={this.state.volumeProfileBins.d}
                    chartLabel={this.state.chartLabels.d}
                    leftClick={()=>this.leftClick.bind(this)}
                    rightClick={()=>this.rightClick.bind(this)}
                    doubleClick={()=>this.doubleClick.bind(this)}
                    candleSize={this.state.possibleIntervals[this.state.chartLabels.d]}
                />: <span><FA name="cog" spin size='5x' /> {this.state.chartLabels.d} candles</span>}
            </div>
        </div>
    }
}

render(
    <ChartComponent />,
    document.getElementById("root")
);
