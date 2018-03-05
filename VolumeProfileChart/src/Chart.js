
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	VolumeProfileSeries,
	CandlestickSeries,
	BollingerSeries,
	RSISeries,
	MACDSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
	EdgeIndicator,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
	RSITooltip,
	MACDTooltip,
} from "react-stockcharts/lib/tooltip";
import { 
	change, 
	bollingerBand, 
	rsi,
	macd, 
} from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class VolumeProfileChart extends React.Component {
	render() {

		const changeCalculator = change();

		const { type, data: initialData, width, ratio, height } = this.props;

		// const mainChartHeight = height/2
		const mainChartHeight = height * 2/3
		const subChartHeight = height/8

		const rsiCalculator = rsi()
			.options({ windowSize: 14 })
			.merge((d, c) => {d.rsi = c;})
			.accessor(d => d.rsi);

		// defaults
		// const BB = {
		// 	windowSize: 20,
		// 	// source: d => d.close, // "high", "low", "open", "close"
		// 	sourcePath: "close",
		// 	multiplier: 2,
		// 	movingAverageType: "sma"
		// }
		const bb = bollingerBand()
			.merge((d, c) => {d.bb = c;})
			.accessor(d => d.bb);

		// defaults
		// const MACD = {
		// 	fast: 12,
		// 	slow: 26,
		// 	signal: 9,
		// 	// source: d => d.close, // "high", "low", "open", "close"
		// 	sourcePath: "close",
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

		const bbStroke = {
			top: "#964B00",
			middle: "#000000",
			bottom: "#964B00",
		};
		const bbFill = "#4682B4";

		const macdAppearance = {
			stroke: {
				macd: "#FF0000",
				signal: "#00F300",
			},
			fill: {
				divergence: "#4682B4"
			},
		};

		const chartMargin = { left: 40, right: 80, top: 10, bottom: 30 }

		const start = xAccessor(last(data));
		// const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const end = xAccessor(data[Math.max(0, data.length - 1000)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas height={height}
				width={width}
				ratio={ratio}
				margin={chartMargin}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>

				<Chart id={4} 
					yExtents={macdCalculator.accessor()}
					padding={{ top: 10, bottom: 10 }}
					origin={(w, h) => [0, h - subChartHeight]} 
					height={subChartHeight}
				>
					{<XAxis axisAt="bottom" orient="bottom"/>}
					<YAxis axisAt="right" orient="right" ticks={2} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
						rectRadius={5}
					/>
{					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".2f")}
					/>}

					<MACDSeries yAccessor={d => d.macd}
						{...macdAppearance} />
{					<MACDTooltip
						origin={[-38, 15]}
						yAccessor={d => d.macd}
						options={macdCalculator.options()}
						appearance={macdAppearance}
					/>}
				</Chart>

				<Chart id={3}
					yExtents={[0, 100]}
					origin={(w, h) => [0, h - subChartHeight*2]}
					height={subChartHeight} 
				>
					{/*<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />*/}
					<YAxis axisAt="right"
						orient="right"
						tickValues={[30, 50, 70]}/>
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".2f")} 
						/>

					<RSISeries yAccessor={d => d.rsi} />

					<RSITooltip origin={[-38, 15]}
						yAccessor={d => d.rsi}
						options={rsiCalculator.options()} />
				</Chart>

				<Chart id={2}
					yExtents={[d => d.volume]}
					height={mainChartHeight}
					// height={subChartHeight} 
					// origin={(w, h) => [0, h - 150]}
				>
					{/*<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>*/}
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume}
						widthRatio={0.95}
						opacity={0.3}
						fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
					/>
				</Chart>
				<Chart id={1}
					yExtents={[d => [d.high, d.low]]}
					padding={{ top: 40, bottom: 20 }}
					height={mainChartHeight}
				>
					{/*<XAxis axisAt="bottom" orient="bottom"/>*/}
					<YAxis axisAt="right" orient="right" ticks={30} />
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<VolumeProfileSeries bins={100} orient='right' />
					<CandlestickSeries />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-40, 0]} />

					<BollingerSeries yAccessor={d => d.bb}
						stroke={bbStroke}
						fill={bbFill} 
						/>

				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

VolumeProfileChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

VolumeProfileChart.defaultProps = {
	type: "svg",
};
VolumeProfileChart = fitWidth(VolumeProfileChart);

export default VolumeProfileChart;
