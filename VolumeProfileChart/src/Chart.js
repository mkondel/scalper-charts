
import React from 'react';
import PropTypes from 'prop-types';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import { ChartCanvas, Chart } from 'react-stockcharts';
import {
	BarSeries,
	VolumeProfileSeries,
	CandlestickSeries,
	BollingerSeries,
	RSISeries,
	MACDSeries,
} from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
	EdgeIndicator,
} from 'react-stockcharts/lib/coordinates';

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import {
	OHLCTooltip,
	RSITooltip,
	MACDTooltip,
} from 'react-stockcharts/lib/tooltip';
import { 
	change, 
	bollingerBand, 
	rsi,
	macd, 
} from 'react-stockcharts/lib/indicator';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';
import { Label } from 'react-stockcharts/lib/annotation'
import { ClickCallback } from 'react-stockcharts/lib/interactive'

class VolumeProfileChart extends React.Component {
	render() {

		const changeCalculator = change();

		const { type,
			data: initialData,
			width,
			ratio,
			height,
			maxCandles,
			volumeProfileBins,
			chartLabel,
			leftClick,
			rightClick,
			doubleClick,
		 } = this.props;

		const candleOffset = 2

		// const mainChartHeight = height/2
		const mainChartHeight = height * 5/8
		const subChartHeight = height * 1/8 - 10

		const rsiCalculator = rsi()
			.options({ windowSize: 14 })
			.merge((d, c) => {d.rsi = c;})
			.accessor(d => d.rsi);
		const rsiAppearance = {
			stroke: {line: '#FFFF00', top: '#AAAAAA', middle: '#FFFFFF', bottom: '#FFFFFF'},
			opacity: {line: 1, top: 0.5, middle: 0.2, bottom: 0.5},
			overSold: 70, middle: 50, overBought: 30,
		}

		// defaults
		// const BB = {
		// 	windowSize: 20,
		// 	// source: d => d.close, // 'high', 'low', 'open', 'close'
		// 	sourcePath: 'close',
		// 	multiplier: 2,
		// 	movingAverageType: 'sma'
		// }
		const bb = bollingerBand()
			.merge((d, c) => {d.bb = c;})
			.accessor(d => d.bb);

		// defaults
		// const MACD = {
		// 	fast: 12,
		// 	slow: 26,
		// 	signal: 9,
		// 	// source: d => d.close, // 'high', 'low', 'open', 'close'
		// 	sourcePath: 'close',
		// }
		const macdCalculator = macd()
			.options({
				fast: 12,
				slow: 26,
				signal: 9,
			})
			.merge((d, c) => {d.macd = c;})
			.accessor(d => d.macd);

		const calculatedData = macdCalculator(rsiCalculator(bb(changeCalculator(initialData))));
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);



		const chartMargin = { left: 40, right: 80, top: 20, bottom: 20 }

		const start = xAccessor(last(data));
		// const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const end = xAccessor(data[Math.max(0, data.length - maxCandles)]);
		const xExtents = [start+candleOffset, end];


		// cancel all orders and all products on RMB click
		const rightMouseClick = (moreProps, e) => rightClick()
		// add an order at current mouse hover price
		const leftMouseClick = (moreProps, e) => {
			// const price = parseFloat(moreProps.chartConfig.yScale.invert(moreProps.mouseXY[1])).toFixed(2)
			leftClick()
		}
		// add an order at close of clicked candle
		const leftMouseDoubleClick = (moreProps, e) => {
			// const price = parseFloat(moreProps.currentItem.close).toFixed(2)
			doubleClick()
		}

		const bbStyles = {
			stroke: {
				top: '#BBBBBB00',
				middle: '#88888877',
				bottom: '#BBBBBB00',
			},
			fill: '#4682FF',
		}
		const macdAppearance = {
			stroke: {
				macd: '#AAAAFF',
				signal: '#FF5A00',
			},
			fill: {
				divergence: '#2341B4'
			},
		};
		const tooltipStyles = {
			labelFill: '#FFFFFF',
			textFill: '#FFFFFF',
		}
		const ohclTooltipStyles = {
			labelFill: '#9999FF',
			textFill: '#FFFFFF',
			xDisplayFormat: timeFormat("%Y-%m-%d %H:%M:%S"),
		}
		const axisStyles = {
			tickStroke: '#FFFFFF',
			stroke: '#FFFFFF',
		}
		const coorinateStyles = {
			// fill: '#FFFFFF',
		}
		const crossHairStyles = {
			stroke: '#FFFFFF'
		}
		const candleStickStyles = {
			opacity: 1,
			wickStroke: '#FFFFFF',
			// stroke: '#FFFFFF55',
			stroke: '#000000',
			// stroke: d => d.close > d.open ? '#6BA583' : '#FF0000',
			candleStrokeWidth: 1,
			// widthRatio: 0.5,
			fill: d => d.close > d.open ? '#6BA583' : '#FF0000',
		}
		const volumeProfileStyles = {
			opacity: 0.6,
			bins: volumeProfileBins,
			orient: 'right' ,
			maxProfileWidthPercent: 30,
			stroke: '#000000',
			partialStartOK: false,
			partialEndOK: false,
		}
		const volumeBarsStyles = {
			widthRatio: 1,
			opacity: 0.5,
			fill: d => d.close > d.open ? '#6BA583' : '#FF0000',
			stroke: false,
		}
		const edgeStyles = {
			lineStroke: 'white',
			fill: d => d.close > d.open ? '#6BA583' : '#FF0000',
		}

		return (
			<ChartCanvas height={height}
				width={width}
				ratio={ratio}
				margin={chartMargin}
				type={type}
				seriesName='MSFT'
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>

				<Chart id={4} 
					yExtents={macdCalculator.accessor()}
					// padding={{ top: 10, bottom: 10 }}
					origin={(w, h) => [0, h - subChartHeight]} 
					height={subChartHeight}
				>
					<XAxis axisAt='top' orient='top' showTicks={false} {...axisStyles} />
					<YAxis axisAt='left' orient='left' showTicks={true} ticks={4} {...axisStyles}/>
					<XAxis axisAt='bottom' orient='bottom' showTicks={false} {...axisStyles} />

{					<MouseCoordinateY
						at='left'
						orient='left'
						displayFormat={format('.2f')}
						{...coorinateStyles}
					/>}

					<MACDSeries yAccessor={d => d.macd}
						{...macdAppearance} />
{					<MACDTooltip
						origin={[5, 15]}
						yAccessor={d => d.macd}
						options={macdCalculator.options()}
						appearance={macdAppearance}
						{...tooltipStyles}
					/>}
				</Chart>

				<Chart id={3}
					yExtents={[0, 100]}
					origin={(w, h) => [0, h - subChartHeight*2]}
					height={subChartHeight} 
				>
					<XAxis axisAt='top' orient='top' showTicks={false} outerTickSize={0} {...axisStyles} />
					<YAxis axisAt='right' orient='right' tickValues={[30, 50, 70]} {...axisStyles}/>
					<MouseCoordinateY
						at='left'
						orient='left'
						displayFormat={format('.2f')} 
						{...coorinateStyles}
						/>

					<RSISeries 
						yAccessor={d => d.rsi} 
						{...rsiAppearance}
					/>

					<RSITooltip origin={[5, 15]}
						yAccessor={d => d.rsi}
						options={rsiCalculator.options()} 
						{...tooltipStyles}
					/>
				</Chart>

				<Chart id={2}
					yExtents={[d => d.volume]}
					height={subChartHeight - 10}
					origin={(w, h) => [0, h - subChartHeight*3 + 10]}
				>
					<MouseCoordinateY
						at='left'
						orient='left'
						displayFormat={format('.4s')} 
						{...coorinateStyles}
					/>

					<BarSeries yAccessor={d => d.volume}
						{...volumeBarsStyles}
					/>
				</Chart>
				<Chart id={1}
					yExtents={[d => [d.high , d.low ]]}
					padding={{ top: 30, bottom: 30 }}
					height={mainChartHeight}
				>
					<Label text={chartLabel} y={-5} x={-20} textAnchor='left' fill='#FFFFFF'/>
{					<MouseCoordinateX
						at='bottom'
						orient='top'
						displayFormat={timeFormat('%Y-%m-%d %H:%M:%S')} />}
					<MouseCoordinateY
						at='right'
						orient='right'
						displayFormat={format('.2f')} 
						{...coorinateStyles}
					/>

					<BollingerSeries yAccessor={d => d.bb} {...bbStyles}/>
					
					<VolumeProfileSeries {...volumeProfileStyles}/>

					<OHLCTooltip origin={[20, -10]} {...ohclTooltipStyles} />
					
					<ClickCallback
						// left mouse button
						onClick={ leftMouseClick }
						// right mouse button
						onContextMenu={ rightMouseClick }
						onDoubleClick={ leftMouseDoubleClick }
					/>

					<CandlestickSeries {...candleStickStyles}/>
					
					<XAxis axisAt='top' orient='bottom' showTicks={false} {...axisStyles}/>
					<XAxis axisAt='bottom' orient='top' ticks={5} {...axisStyles}/>
					<YAxis axisAt='right' orient='right' ticks={10}  {...axisStyles}/>
					<YAxis axisAt='right' orient='right' showTicks={false}  {...axisStyles}/>
					<YAxis axisAt='left' orient='left' showTicks={false}  {...axisStyles}/>

					<EdgeIndicator
						yAccessor={d => d.close} 
						itemType='last'
						orient='right'
						edgeAt='right'
						{...edgeStyles}
					/>
				</Chart>
				<CrossHairCursor {...crossHairStyles} />
			</ChartCanvas>
		);
	}
}

VolumeProfileChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
};

VolumeProfileChart.defaultProps = {
	type: 'hybrid',
};
VolumeProfileChart = fitWidth(VolumeProfileChart);

export default VolumeProfileChart;
