/* eslint-env node */
// This is a basic Gruntfile illustrating how to call the sw-precache library. It doesn't include
// all of the functionality from  the sample gulpfile, such as running a web server, or managing
// separate DEV and DIST directories.

'use strict';

var packageJson = require('../package.json');
var path = require('path');
var swPrecache = require('sw-precache/lib/sw-precache.js');
var routes = require("./routes.js");
var navigateFallbackWhitelist = [];

for(var key in routes){
    var route = routes[key];
    //navigateFallbackWhitelist.push(pathToRegexp(route));
    navigateFallbackWhitelist.push(route);
}

module.exports = function(grunt, target) {


    grunt.mergeConfig({
        swPrecache: {
            dev: {
                handleFetch: true,
                rootDir: '.'
            }
        }
    });

    function writeServiceWorkerFile(rootDir, handleFetch, callback) {

        
        

        if (target == "stag") {
            var dynamicPath = "https://static.naukimg.com/s/5/135/j/";
            var staticPath = "gen";
            var staticExt = ".min";
            var replacePrefix = "https://static.naukimg.com/s/5/135";
        }
        if(target == "dev"){
            var dynamicPath = "http://localhost:3000/j/";
            var staticPath = "src";
            var staticExt = "";
            var replacePrefix = "";
        }



        var config = {
            cacheId: packageJson.name,
            // clientsClaim: true,
            /*dynamicUrlToDependencies: {
              'dynamic/page1': [
                path.join(rootDir, 'views', 'layout.jade'),
                path.join(rootDir, 'views', 'page1.jade')
              ],
              'dynamic/page2': [
                path.join(rootDir, 'views', 'layout.jade'),
                path.join(rootDir, 'views', 'page2.jade')
              ]
            },*/
            // If handleFetch is false (i.e. because this is called from swPrecache:dev), then
            // the service worker will precache resources but won't actually serve them.
            // This allows you to test precaching behavior without worry about the cache preventing your
            // local changes from being picked up during the development cycle.
            handleFetch: handleFetch,
            logger: grunt.log.writeln,
            importScripts : ['./sw-notification.js?v=2'],
            staticFileGlobs: [
                staticPath + '/c/fonts/**/*.woff2',
                staticPath + '/c/**/*' + staticExt + '.css',
                staticPath + '/i/**/*.*'/*,
                'main.html'*/
            ],
            runtimeCaching: [{
              method : "get",
              //urlPattern: /^http:\/\/dev1\.static\.infoedge\.com\/s/,
              urlPattern: new RegExp('^'+dynamicPath),
              handler: 'fastest'/*,
              options: {
                cache: {
                  maxEntries: 10,
                  name: 'searchFlow-cache'
                }
              }*/
            }],
            stripPrefix: staticPath,
            replacePrefix: replacePrefix,
            /*stripPrefixMulti: {
              'main.html': './'
            },*/
            // verbose defaults to false, but for the purposes of this demo, log more.
            verbose: true,
            directoryIndex: false,
            navigateFallback: './',
            navigateFallbackWhitelist: navigateFallbackWhitelist
                //navigateFallbackWhitelist: [/^(?!.*\.js).*$/]

        };

        swPrecache.write(path.join(rootDir, 'service-worker_wapp.js'), config, callback);
    }

    grunt.registerMultiTask('swPrecache', function() {
        var done = this.async();
        var rootDir = this.data.rootDir;
        var handleFetch = this.data.handleFetch;

        writeServiceWorkerFile(rootDir, handleFetch, function(error) {
            if (error) {
                grunt.fail.warn(error);
            }
            done();
        });
    });
};
