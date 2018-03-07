window.ws = new WebSocket("wss://ws-feed.gdax.com");

var params = {
  "type": "subscribe",
  "channels": [{
      "name": "ticker",
      "product_ids": [
        "ETH-USD",
        "BTC-USD",
        "LTC-USD"
      ]
    }
  ]
}

window.ws.onopen = () => {
  console.log('window opened 1')
  window.ws.send(JSON.stringify(params));
  console.log('window opened 2')
}

window.ws.onmessage = (msg) => {
  var data = JSON.parse(msg.data);
  if(data.type === 'ticker') {
    var product = data.product_id;

    switch(product) {
      case 'BTC-USD':
        this.coins.btc = data;
        break;
      case 'ETH-USD':
        this.coins.eth = data;
        break;
      case 'LTC-USD':
        this.coins.ltc = data;
        break;
    }
  }
}
