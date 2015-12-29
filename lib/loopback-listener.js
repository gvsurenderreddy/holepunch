'use strict';

var http = require('http');
var https = require('https');
var express = require('express');

var middleware = module.exports.middleware = require('./middleware');

module.exports.create = function (opts) {
  var httpsOptions = opts.httpsOptions || require('localhost.daplie.com-certificates');
  var results = {
    plainServers: []
  , tlsServers: []
  };
  var app = express();

  app.use('/', middleware(opts));

  (opts.plainPorts||[]).forEach(function (plainPort) {
    var plainServer = http.createServer();
    plainServer.__plainPort = plainPort;
    http.on('request', app);
    results.plainServers.push(plainServer);
  });

  (opts.tlsPorts||[]).forEach(function (tlsPort) {
    var tlsServer = https.createServer(httpsOptions);
    tlsServer.__tlsPort = tlsPort;
    http.on('request', app);
    results.tlsServers.push(tlsServer);
  });

  function onListen() {
    /*jshint validthis: true*/
    var server = this;
    var addr = server.address();
    var proto = 'honorCipherOrder' in server ? 'https' : 'http';

    console.info('Listening on ' + proto + '://' + addr.address + ':' + addr.port);
  }

  process.nextTick(function () {
    results.plainServers.forEach(function (plainServer) {
      plainServer.listen(
        plainServer.__plainPort.port
      , plainServer.__plainPort.address || '0.0.0.0'
      , onListen
      );
    });
    results.tlsServers.forEach(function (tlsServer) {
      tlsServer.listen(
        tlsServer.__tlsPort.port
      , tlsServer.__tlsPort.address || '0.0.0.0'
      , onListen
      );
    });
  });

  return results;
};