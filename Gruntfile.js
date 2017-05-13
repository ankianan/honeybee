var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');

var swPrecacheConf = require('./sw-precache.conf.js');

module.exports = function(grunt) {

    var target = grunt.option('target');
    var importPath;
    if (target == "dev") {
        importPath = ["../grunt/pathConfig/dev"];
    } else if (target == "test") {
        importPath = ["../grunt/pathConfig/test"];
    }

    grunt.initConfig({
        env: {
            dev: {},
            test: {},
            test3: {},
            stag: {}
        },
        rollup: {
            appjs: {
                options: {
                    moduleName: "common",
                    format: "iife",
                    plugins: function() {
                        return [
                            nodeResolve({ jsnext: true, main: true }),
                            babel({
                                exclude: '../node_modules/**'
                            }),
                            commonjs({
                                namedExports: {
                                    '../node_modules/react/react.js': ['Children', 'Component', 'PureComponent', 'PropTypes', 'createElement']
                                }
                            }),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify((target != "dev") ? "production" : target)
                            }),
                        ];
                    },
                    globals: {
                        react: 'interfaces["Virtual"]',
                        reactDom: 'interfaces["VirtualDom"]'
                    }
                },
                files: [{
                    'dest': 'src/j/app.js',
                    'src': 'src/app/index.js'
                }]
            }
        },
        watch: {
            appjs: {
                files: ['src/app/*.js', 'src/app/root/**/*.js'],
                tasks: ["rollup:appjs"]
            }
        }
    });



    grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
    require('grunt-config-merge')(grunt);
    require('../grunt/global/grunt-lifecycle.js')(grunt);

    swPrecacheConf(grunt, target);
    grunt.registerTask('interfaces', ["rollup:interfaces"]);
    grunt.registerTask('default', ["rollup:appjs", "tocss"]);
};
