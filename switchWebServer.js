var wifi = require('Wifi');

var clients = [];

var WIFI_NAME = "[replace this]";

var WIFI_OPTIONS = {
  password: "[replace this]"
};

switchState = "off";
onSelectedString = "";
offSelectedString="selected";
onOffCheckString = "off";


function onInit() {
  digitalWrite(0, switchState  == onOffCheckString);
  print("connecting...");
  // Connect to WiFi
  wifi.connect(WIFI_NAME, WIFI_OPTIONS, err => {
    if (err !== null) {
      throw err;
    }
    // Print IP address
    wifi.getIP((err, info) => {
      if (err !== null) {
        throw err;
      }
      print("http://"+info.ip);
      startServer();
    });
  });
}

// Create and start server
function startServer() {
  const s = require('ws').createServer(pageHandler);
  s.on('websocket', wsHandler);
  s.listen(80);
}

// Page request handler
function pageHandler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end(`<html>
<head>
<script>
window.onload = () => {
  var ws = new WebSocket('ws://' + location.host, 'protocolOne');
  var rstate = document.getElementById('rstate');
  var relay = document.getElementById('relay');
  ws.onmessage = evt => {
    rstate.innerText = evt.data;
    relay.value=evt.data;
  };
  relay.onchange = evt => {
    ws.send(relay.value);
  };
};
</script>
</head>
<body>
  <p>Relay Normal Close state <span id="rstate">`+ switchState + `</span></p><p>(on : close, off: open):
    <select id="relay">
      <option ` + offSelectedString +` >off</option>
      <option ` + onSelectedString +` >on</option>
    </select>
  </p>
</body>
</html>`);
}

// WebSocket request handler
function wsHandler(ws) {
  clients.push(ws);
  ws.on('message', msg => {
    if (switchState != msg){
      digitalWrite(0, msg == onOffCheckString);
      switchState = msg;
      onSelectedString = (switchState == 'on'?  "selected" : "");
      offSelectedString = (switchState == 'off'? "selected" : "");
      setTimeout("broadcast(switchState );", 10);
    }
  });
  ws.on('close', evt => {
    var x = clients.indexOf(ws);
    if (x > -1) {
      clients.splice(x, 1);
    }
  });
}

// Send msg to all current websocket connections
function broadcast(msg) {
  clients.forEach(cl => cl.send(msg));
}
