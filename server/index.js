const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
	ws.on('message', async (msg) => {
		msg = await JSON.parse(msg)
		console.log('received: %s', msg);
		if (msg.type === "ping") {
			ws.send(JSON.stringify({type: "pong", time: Date.now()/1000}));
			console.log("sent pong");
		}
	});
});

