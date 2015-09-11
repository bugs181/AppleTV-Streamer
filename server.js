// AppleTV Proxy Server for Trailers app. (Includes DNS server)

// Logging
var ansi = require('ansi'), cursor = ansi(process.stdout);

// DNS Server
var dnsServer = require("dns-server");
cursor.hex('#2EAEBB');
dnsServer.config(require("./config").dnsConfig)
dnsServer.start();
cursor.reset();

// DNS logging functions
dnsServer.logRequest(function(log) {
  cursor.hex('#551A8B').write(log + '\r\n').reset()
})

dnsServer.logHit(function(log) {
  cursor.hex('#2EAEBB').write(log + '\r\n').reset()
})

// Express server with http + https
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

// File modules
var fs = require('fs')
var path = require('path')

// Mime lookups for files
var mime = require('mime')

// Server side templating engine; not to be confused with client side EJS that ATV uses.
var template = require('./template')


// http + https server
var privateKey = fs.readFileSync('./cert/trailers.key', 'utf8');
var certificate = fs.readFileSync('./cert/trailers.pem', 'utf8');

var credentials = {
    key: privateKey,
    cert: certificate
};

http.createServer(app).listen(80);
https.createServer(credentials, app).listen(443);


// http proxy
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

// Pass all requests through this function.
app.use(function (req, res, next) {
  // If local file exists, then serve it - otherwise proxy to Apple servers.
  //var isLocalFile = false;
  var file = path.resolve('web/' + req.url);
  //if (fs.existsSync(file))  isLocalFile = true
  var isLocalFile = fs.existsSync(file) // todo: make this async.

  logRequest(req, isLocalFile);

  // isLocalFile = false // Turn this switch on to use Apple Trailers
  if (isLocalFile) {
    serveLocalFile(req, res, file)
  } else {
    apiProxy.web(req, res, { target: req.protocol + '://trailers.apple.com' });
  }
})

function logRequest(req, isLocalFile) {
  // Log output with colors
  var protocolColor = '#2EAEBB'
  if (req.protocol == "http") {
    protocolColor = '#2EAEBB'
  } else if (req.protocol == "https") {
    protocolColor = '#0033CC'
  }

  var redirectColor = '#FFD700'
  if (isLocalFile)  redirectColor = '#D35003'

  cursor.hex(protocolColor).write("[" + req.protocol + "] ")
    .hex(redirectColor).write(req.url + "\r\n").reset();
}

function serveLocalFile(req, res, fileName) {
  fs.readFile(fileName, function(err, localFile) { // templateFile
    if (err) {
      console.log(err) //throw err;
      res.status(500).send(err)
      return;
    }

    var mimetype = mime.lookup(fileName);
    res.header("Content-Type", mimetype)

    var url = req.url
    if (template.file(url)) {

      //res.send(localFile);
      //return;

      //template.compile(url, localFile, function(err, compiledFile) {
      template.compile(url, fileName, function(err, compiledFile) {
        if (err) {
          res.status(500).send("Internal server error")
          return
        }

        res.send(compiledFile)
      })

      //template.compile(url, localFile, res.send)

      return
    }

    res.send(localFile)
  })

  //res.sendFile(file)
}

cursor.hex('#2EAEBB').write("Waiting for web requests \r\n").reset();

// http://trailers.apple.com/appletv/us/js/Trailers.Showtimes.js
