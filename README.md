* [Project goals](#goals)
* [Original idea](#idea)
* [Screenshots](#pics)
* [How to run](#how)

# <a name="goals"></a>Goals
- ~4 pane window with 2x2 charts~
- ~Volume profile, MACD, RSI~
- Live candle updates via WebSockets
- Save all settings and chart tools
- Each chart can toggle:
 -- Time interval: 1min, 5min, 15min, 30min, 1hr, 4hr, 1day, 1week
 -- Indicators: BB, volume profile, RSI, MACD
- Allow fibs and trendlines

# <a name="idea"></a>Original idea
For example:

```
|========|========|
|   1m   |   1h   |
|        |        |
|========|========|
|   15m  |   1d   |
|        |        |
|========|========|
```


# <a name="pics"></a>Screenshots
And this is what it looks like on Mar 5, 2018:
![Picture](https://user-images.githubusercontent.com/3288757/37013145-67d9b83a-20c6-11e8-94d0-2dba51cb5856.png)


# <a name="how"></a>How to run
How to run:
- git clone https://github.com/mkondel/scalper-charts.git
- cd scalper-charts
- yarn && yarn start