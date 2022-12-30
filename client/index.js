const WebSocket = require('ws');

let lastOnline = Date.now()/1000; // unix timestamp
let ws = undefined;

function connect() {
	try {
		ws = new WebSocket('ws://localhost:8080');
		ws.on('open', function open() {
			lastOnline = Date.now()/1000;
			console.log("connection opened");
		});
		ws.on('message', async (msg) => {
			msg = await JSON.parse(msg);
			if (msg.type === "pong") {
				lastOnline = Date.now()/1000;
			}
		});
		ws.on("error", (e) => {
			ws.close();
			console.log(`Some error occured: ${e}`)
			ws = undefined;
		});
	} catch (e) {
		console.log("Can't connect");
		ws = undefined;
	}
}

setInterval(() => {
	if (ws) {
		ws.send(JSON.stringify({type: "ping"}));
		if (lastOnline < Date.now()/1000-5) {
			console.log("connection lost, retrying...");
			ws.close(); connect();
			lastOnline = Date.now()/1000;
		}
	} else connect();
}, 1000);


