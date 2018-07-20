var express = require('express');
var path = require('path');
var logger = require('morgan');

let { ServiceBroker } 	= require("moleculer");
const ApiGatewayService = require("moleculer-web");

var app = express();

// Create broker
let broker = new ServiceBroker({
  logger: console,
  logLevel: "debug"
});
broker.loadServices(path.join( "server","services"));


app.use(require('cors')());
app.use(require('body-parser').json());

app.use(logger('dev'));

// Load API Gateway
const svc = broker.createService({
	mixins: ApiGatewayService,
	settings: {
    middleware: true,
    metrics: true,
    logger: true,
    logLevel: "debug",
    hotReload: true,
    cacher: "memory",
		routes: [{
			whitelist: [
				"twitter.*",
      ],
      logRequestParams: "info",

      logResponseData: "debug",
			aliases: {
        "GET twitter/user": "twitter.user",
        "GET twitter/home": "twitter.home",
        "GET home": "twitter.home",
        "health": "$node.health",
      },
      onBeforeCall(ctx, route, req, res) {
        this.logger.debug('Before Call ', route)
        ctx.meta.userAgent = req.headers["user-agent"];
      },

      // Call after `broker.call` and before send back the response
      onAfterCall(ctx, route, req, res, data) {
        res.setHeader("X-Custom-Header", "SIPA-Twitter-Client");
	return data;
      },

      // Route error handler
      onError(req, res, err) {
        res.setHeader("Content-Type", "text/plain");
        res.writeHead(err.code || 500);
        res.end("Route error: " + err.message);
      }
		}]
	}
});

app.use("/api", svc.express());
broker.start();

app.listen(3000, () => console.log('Server running'));
// module.exports = app;
