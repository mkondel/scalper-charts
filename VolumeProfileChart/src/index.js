import React from 'react';
import FA from 'react-fontawesome';
import { render } from 'react-dom';
import Chart from './Chart';
import { getInitialData } from "./utils"
import { Modal, Button } from 'react-bootstrap'

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
                '6hr': 60*60*6,
                '1day': 60*60*24,
            },
            chartLabels: {
                'a': '1min',
                'b': '15min',
                'c': '1hr',
                'd': '6hr',
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
            showModal: false,
            showCharts: 'hide',
            cog: true,
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
    // remove the listeners
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
        window.removeEventListener("keyup", this.updateDimensions.bind(this));
    }
    componentDidMount() {
        // enable window size changes to redraw the charts
        window.addEventListener("resize", this.updateDimensions.bind(this));
        
        // handle keyboard shortcuts
        window.addEventListener("keyup", this.onKeyUp.bind(this));

        // loads initial candle data from gdax over a simple GET API 
        getInitialData({getState: this.getState.bind(this), stateUpdate: this.setState.bind(this), done: cb=>{
	        // update the charts for the 1st time
	        this.setState({showCharts:'show', cog: false}, ()=>this.updateDimensions());

	        // start live data
	        cb({getState: this.getState.bind(this), stateUpdate: this.setState.bind(this)});
        }})
    }
    getState(){
    	return this.state;
    }
    onKeyUp(event){
	    switch(event.keyCode){
	    	case 13: 	// ENTER key
	    		break;
	    	case 32: 	// SPACE key
	    		this.handleOpenModal()
	    		break;
	    	default:
	    		// alert(event.keyCode);
	    		break;
	    }
	}

    render() {
        return this.state.showModal ? 
        	<MoDaL handleCloseModal={this.handleCloseModal.bind(this)}/>
		:
		<div className={`mainDiv ${this.state.cog ? 'pad-it':null}`}>
			{this.state.cog ? <FA name="cog" spin size='5x' /> : null}
	        <div className={`charts ${this.state.showCharts}`}>
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
		                /> : <div>{`Loading ${this.state.chartLabels.a}`} <FA name='cog' spin size='5x'/></div>}
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
		                />: <div>{`Loading ${this.state.chartLabels.b}`} <FA name='cog' spin size='5x'/></div>}
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
		                />: <div>{`Loading ${this.state.chartLabels.c}`} <FA name='cog' spin size='5x'/></div>}
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
		                />: <div>{`Loading ${this.state.chartLabels.d}`} <FA name='cog' spin size='5x'/></div>}
	            </div>
	        </div>
		</div>
    }
}

render(
    <ChartComponent />,
    document.getElementById("root")
);


const MoDaL = ({handleCloseModal}) => 
	<div className="static-modal">
	  <Modal.Dialog 
	  	onHide={handleCloseModal}
	  	keyboard={true}
	  	autoFocus={true}
	  >
		  <Modal.Header>
		        <Modal.Title>Modal title</Modal.Title>
		    </Modal.Header>

		    <Modal.Body>One fine body...</Modal.Body>

			<Modal.Footer>
			    <Button onClick={handleCloseModal}>Close</Button>
			</Modal.Footer>
		</Modal.Dialog>
	</div>