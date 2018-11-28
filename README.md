scalper-charts helps traders make educated decisions fast. The typical use-case is to have 4 time frames open on the same asset. Time your entry/exits on the smallest time scale, while keeping an eye on the long term trends.

# Contents
* [Live Demo](#demo)
* [Project goals](#goals)
* [How to run](#how)
* [Original idea](#idea)
* [Examples](#examples)
* [Screenshots](#pics)

# <a name="demo"></a>Live Demo
[Scalper Charts](http://scalperman.s3-website-us-east-1.amazonaws.com/ "Scalper Helper") demo running on AWS Beanstalk.

# <a name="goals"></a>Goals
- ~4 pane window with 2x2 charts~
- ~Volume profile, MACD, RSI~
- ~Live candle updates via WebSockets~
- Each chart can toggle:
 -- Time interval: 1min, 5min, 15min, 30min, 1hr, 4hr, 1day, 1week
 -- Indicators: BB, volume profile, RSI, MACD
- Save all settings and chart tools
- Allow fibs and trendlines

# <a name="how"></a>How to run
```bash
git clone https://github.com/mkondel/scalper-charts.git
cd scalper-charts
yarn && yarn start
```

# <a name="idea"></a>Original idea

```
|========|========|
|   1m   |   5m   |
|        |        |
|========|========|
|   15m  |   1h   |
|        |        |
|========|========|
```

# <a name="examples"></a>Examples
By default the windows are 1min, 15min, 1hour and 1day. The indicators are Bollinger bands, MACD, RSI and volume profile.

# <a name="pics"></a>Screenshots
Mar 5, 2018:
![Mar 5, 2018](https://user-images.githubusercontent.com/3288757/37013145-67d9b83a-20c6-11e8-94d0-2dba51cb5856.png)
Morning of Mar 8, 2018:
![Mar 8, 2018](https://user-images.githubusercontent.com/3288757/37135059-8114e76c-2269-11e8-995f-4857e6a79828.png)
Evening on Mar 8, 2018:
![Mar 8, 2018](https://user-images.githubusercontent.com/3288757/37188445-2c59ac1c-231d-11e8-81ff-8753fdfcd32e.png)
