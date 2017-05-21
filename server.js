var http = require('http');
var https = require('https');
var express = require('express');
var compress = require('compression');
var fs = require('fs');
//This dependecies should be avoided
var pathToRegexp = require('path-to-regexp');
var expressRoutes = require('./expressRoutes.js');

var path = require('path');
var app = express();
var routes = require("./expressRoutes.js");

app.use(compress());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/src'));


//All the requests to the server are entertained. Route handling is configured in RouteConfig
app.get('/honeybee*', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var convertToRegexRoutes = function(routes) {
    var regexRoutes = {};
    for (var key in routes) {
        regexRoutes[key] = pathToRegexp(routes[key]).toString();
    }
    return JSON.stringify(regexRoutes);
};

fs.writeFile("./regexRoutes.js", "module.exports=" + convertToRegexRoutes(expressRoutes));


app.listen(3000, function() {
    console.log('server started....')
});
