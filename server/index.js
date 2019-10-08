
//const Path = require('path');
const Hapi = require('@hapi/hapi');
const Webpack = require('webpack');

const Config = require('../webpack.config.js');
const host = 'localhost';
const port = 3000;

const compiler = Webpack(Config);

const useWebpackMiddleware = require('webpack-dev-middleware')(compiler, {
    host,
    port,
    historyApiFallback: true,
    publicPath: Config.output.publicPath,
    quiet: false, 
    noInfo: false,
    stats: {
        colors: true,
        assets: true
    },
    writeToDisk: true    
});

const useWebpackHotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => { console.log('............ HOT...');}
});


const server = new Hapi.Server({
    port: port,
    host: host
});

server.ext('onRequest', (request, h) => {
    try { 
        useWebpackMiddleware(request.raw.req, request.raw.res, () => {
            request.setUrl('/');
            return h.continue;
        });
    } catch (err) {
        console.log('useWebpackMiddleware ..... ', err);
    }
});

server.ext('onRequest', (request, h) => {
    try { 
        useWebpackHotMiddleware(request.raw.req, request.raw.res, () => {
            return h.continue;
        });
    } catch (err) {
        console.log('useWebpackHotMiddleware ..... ', err);
    }
});

server.route({ method: 'GET', path: '/', handler: () => 'ok' });

// Start the server
async function start() {
    try {
      await server.start();
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  
    console.log("Server running at:............................", server.info.uri);
  }
  
  start();