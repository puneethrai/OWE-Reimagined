module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                options: {
                    base: "",
                    port: 9999
                }
            }
        },

        jasmine: {
            components: {
                src: [
                    'www/js/*js',
                    'www/js/transactions/**.js',
                    'www/js/friends/**.js'
                ],
                options: {
                    specs: 'spec/spec/*.js',
                    keepRunner: true,
                    vendor: [
                        'www/js/lib/jquery/*js',
                        'www/js/lib/underscore/*js',
                        'www/js/lib/boostrap/*js',
                        'www/js/lib/backbone/*js',
                        'spec/vendor/jasmine-jquery.js',
                        'spec/vendor/jasmine-jsreporter.js'
                    ],
                    template: "spec/SpecRunner.tmpl"
                    //helpers: 'test/spec/*.js'
                }
            }
        },
        sass: { // Task
            dist: { // Target
                options: { // Target options
                    style: 'compressed',
                    sourcemap: "none"
                },
                files: { // Dictionary of files
                    'OWE/www/css/index.css': 'OWE/scss/index.scss', // 'destination': 'source'
                }
            }
        },
        watch: {
            tests: {
                files: ['www/**', 'spec/**'],
                tasks: ['travis']
            },
            sass: {
                files: ['scss/**'],
                tasks: ['sass']
            }
        },
        cordovacli: {
            options: {
                path: 'OWE',
                cli: 'cordova' // cca or cordova
            },
            cordova: {
                options: {
                    command: ['create', 'platform', 'plugin', 'build'],
                    platforms: ['browser', 'wp8'],
                    plugins: [],
                    path: 'OWE',
                    id: 'com.friends.owe',
                    name: 'OWE'
                }
            },
            create: {
                options: {
                    command: 'create',
                    id: 'com.friends.owe',
                    name: 'OWE'
                }
            },
            add_platforms: {
                options: {
                    command: 'platform',
                    action: 'add',
                    platforms: ['browser', 'wp8']
                }
            },
            add_plugins: {
                options: {
                    command: 'plugin',
                    action: 'add',
                    plugins: [
                        'cordova-plugin-console',
                        'cordova-plugin-device',
                        'cordova-plugin-dialogs',
                        'cordova-plugin-dialogs',
                        'cordova-plugin-splashscreen',
                        'cordova-plugin-whitelist',
                        'cordova-plugin-statusbar',
                        'com.risingj.cordova.livetiles',
                        'de.appplant.cordova.plugin.local-notification'
                    ]
                }
            },
            remove_plugin: {
                options: {
                    command: 'plugin',
                    action: 'rm',
                    plugins: [
                        'cordova-plugin-console',
                        'cordova-plugin-device',
                        'cordova-plugin-dialogs',
                        'cordova-plugin-dialogs',
                        'cordova-plugin-splashscreen',
                        'cordova-plugin-whitelist',
                        'cordova-plugin-statusbar',
                        'com.risingj.cordova.livetiles',
                        'de.appplant.cordova.plugin.local-notification'
                    ]
                }
            },
            build_ios: {
                options: {
                    command: 'build',
                    platforms: ['ios']
                }
            },
            build_android: {
                options: {
                    command: 'build',
                    platforms: ['android']
                }
            },
            emulate_android: {
                options: {
                    command: 'emulate',
                    platforms: ['android'],
                    args: ['--target', 'Nexus5']
                }
            },
            run_wp8: {
                options: {
                    command: 'run',
                    platforms: ['wp8'],
                    args: ['--device']
                }
            },
            run_browser: {
                options: {
                    command: 'run',
                    platforms: ['browser'],
                    args: ['--device']
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "OWE/www/",
                    out: "OWE/www/main-build.js",
                    name: "app/main",
                    paths: {
                        domReady: './libs/require/domReady',
                        Boiler: './app/core/_boiler_',
                        text: "./libs/require/text",
                        i18n: "./libs/require/i18n",
                        path: "./libs/require/path",
                        jquery: './libs/jquery/jquery-min',
                        underscore: './libs/underscore/underscore-min',
                        backbone: './libs/backbone/backbone-min',
                    },
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-cordovacli');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    // Default task(s).
    grunt.registerTask('default', ['sass']);
    grunt.registerTask('travis', ['jasmine']);
    grunt.registerTask('test-reload', ['travis', 'watch:tests']);
    grunt.registerTask("dev", ["connect", "watch:tests"]);
    grunt.registerTask("prepare", ["cordovacli:add_plugins", "cordovacli:add_platforms"]);

};