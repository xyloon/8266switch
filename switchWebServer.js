require("ESP8266").setCPUFreq(80); //for exp8266-01

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


var imageOff = "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00$\x00\x00\x00$\x08\x03\x00\x00\x00\xd6\xdeh\xaa\x00\x00\x003PLTELiq\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xe5\x7fX\xe5\x00\x00\x00\x10tRNS\x00@\x90P\x80\xa0`\xf0\xc00p\xd0\xe0\x10 \xb0*\x9cW\x80\x00\x00\x00\tpHYs\x00\x00\x05\x89\x00\x00\x05\x89\x01mh\x9d\xfa\x00\x00\x00\xd5IDAT8\xcb\xcd\x93\xd1\x12\x85 \x08D\xb5P\xc9\xb2\xf8\xff\xaf\xbd\x1a\xd6\xd5\t\xe9\xb5}\xa8\x99\xe6\xc4\x02\xae\xc6|F\xcb,\x7f\xdf#\x00\xf8\xc4L / \x16\x8951Cd\x1f\x0cT\x84\xc2R\x19\xf7`\xa6\x13@\xdc\x14f.\x08$s\xf5#1fc\x1b\x95)\x85b\xcb\xd0\xfe\x84\x1c\xd1\xd61\xf7/\x8d\x90\x07\xff3\x92]\x86\xa0\xe9'\xaf\x03\xc7P\xed\xd9\x8d l\xe6Z\xaf\xc2\x9db\xb7g\x9b_\xc2\xf1\xee\xdd\x9es\xa1 \x05 5\x8c#\xd1\xad\xdbsaV\x859j\x1a\xee\x13\x12\x98\xb2\xf5\x14^\x98\x12\xb3\x98\x9f\n\xe3\xf2\x03ae\xd3a\xcfW|A\x9bkB\x96t\x01\xce0\x95\xd9=\xb0\xach\xe79\x18\xaa]>,\xbe\x0b\x9a]Srh\xd6'fd\xd6\\\xbew\xb3o\xe8\x07\x93~\x0fY.\x0e\xa6-\x00\x00\x00\x00IEND\xaeB`\x82";

var imageOn = "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00$\x00\x00\x00$\x08\x03\x00\x00\x00\xd6\xdeh\xaa\x00\x00\x000PLTELiq\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x9b\xb1\x91\xbf\x00\x00\x00\x0ftRNS\x00\x80\xc0\x10\xd0@\xf0\xa0 \x90\xb0P0`\xe0\xf0\xf8\xfa=\x00\x00\x00\tpHYs\x00\x00\x05\x89\x00\x00\x05\x89\x01mh\x9d\xfa\x00\x00\x00\xadIDAT8\xcb\xd5\x94A\x16\x83 \x0cD!\x18@A\xb9\xffm\x9b \xd8\xf6\x15b\x96vV\xa8\x1f&\x89\xa3\xc6<_\xc9\x92\x92\x88X_\xaa\xbc\x9d\x22n)\x97\x16\'1\x07\xc0!P\x1b?B^!\xe3\xdb\x88\xc1\x8f\xed\xf5P\x1c@\x81\xea\xbd,\x1cu\x10\x06\x10\xdd^\xdfW+m\x19@\xdf\x06l\xfe\xcbD\r\xa4:IW\x93\xaa;\xd5\x9c\xea\xc4\xe1\\N\'~n\x0f\xcdY~\xc3\x94\xa5$04+_\r\x81Z\x88\xf3\xd0\xed\\\x161e\x17\x92\x99{\xe6\xb2\x94\xdf\x0e\xc9!o\x92\x98\x0cM\x12\x84\x1a\xbb\xa8\xb1k\x86w_0\xde\xf6\xd6\r\xff\xe0wd^\x16\x97\n\'\xcbW\x9b6\x00\x00\x00\x00IEND\xaeB`\x82";


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

function getRootPage(){
  return (`<html>
<head>
<title>Relay NO state</title>
<script>
window.onload = () => {
  var ws = new WebSocket('ws://' + location.host, 'protocolOne');
  var relay = document.getElementById('relay');
  var imgSwitch = document.getElementById('imgSwitch');
  ws.onmessage = evt => {
    relay.value=evt.data;
    imgSwitch.src=("img_" + evt.data + ".png");
    imgSwitch.alt = evt.data;
  };
  relay.onchange = evt => {
    ws.send(relay.value);
  };
  imgSwitch.onclick = evt => {
    ws.send((imgSwitch.alt == "on" ? "off" : "on"));
  };
};
</script>
</head>
<body>
  <p>Relay NO(Normal Open) state</p>
  <p>State : <img id="imgSwitch" src="img_` + switchState + `.png" alt="` + switchState + `"></p>
  <p>(on : close circuit, off: open circuit):
    <select id="relay">
      <option ` + offSelectedString +` >off</option>
      <option ` + onSelectedString +` >on</option>
    </select>
  </p>
</body>
</html>`);
}

// Page request handler
function pageHandler(req, res) {
  url_parsed = url.parse(req.url, true);
  if (url_parsed.pathname=="/") {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(getRootPage());
  }else if(url_parsed.pathname=="/img_off.png"){
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });
    res.end(imageOff);
  }else if(url_parsed.pathname=="/img_on.png"){
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });
    res.end(imageOn);
  }else if(url_parsed.pathname=="/state"){
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify({'state': switchState} ));
  }else if (url_parsed.pathname=="/on") {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    setTimeout("changeSwitchState('on');", 10);
    res.end(JSON.stringify({'requested_state': 'on'} ));
  }else if (url_parsed.pathname=="/off") {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    setTimeout("changeSwitchState('off');", 10);
    res.end(JSON.stringify({'requested_state': 'off'} ));
  }else{
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("404: Page "+url_parsed.pathname+" not found");
  }
}

function changeSwitchState(targetState){
  if (switchState != targetState){
    digitalWrite(0, targetState == onOffCheckString);
    switchState = targetState;
    onSelectedString = (switchState == 'on'?  "selected" : "");
    offSelectedString = (switchState == 'off'? "selected" : "");
    setTimeout("broadcast(switchState );", 10);
  }
}

// WebSocket request handler
function wsHandler(ws) {
  clients.push(ws);
  ws.on('message', msg => {
    changeSwitchState(msg);
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
