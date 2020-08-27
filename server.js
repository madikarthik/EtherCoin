/* Our custom next-server script which enables custom dynamic routing.

NOTE: change made in package.json. Under scripts "dev" : node server.js

The changes are made automatically when server is running using *npm run dev* */

const { createServer } = require("http");
const next = require("next");
const app = next({
	dev: process.env.NODE_ENV !== "production"
});

// navigation logic

const routes = require("./routes");
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
	createServer(handler).listen(3000, err => {
		if (err) throw err;
		console.log("Ready on localhost:3000");
	});
});
