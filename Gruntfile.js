module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                options: {
                    base: "",
                    port: 9999,
                    keepalive: true
                }
            }
        },

        /*jasmine: {
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
        },*/
        jasmine: {
            taskName: {
                src: [
                    'OWE/www/libs/jquery/*.js',
                    'OWE/spec/vendor/jasmine-jquery.js',],
                options: {
                    specs: 'OWE/spec/spec/*.js',
                    //helpers: '',
                    //host: 'http://127.0.0.1:9999/',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: "OWE/www/",
                            /*
                             * Let's define short alias for commonly used AMD libraries and name-spaces. Using
                             * these alias, we do not need to specify lengthy paths, when referring a child
                             * files. We will 'import' these scripts, using the alias, later in our application.
                             */
                            paths: {
                                // requirejs plugins in use
                                text: './libs/require/text',
                                i18n: './libs/require/i18n',
                                path: './libs/require/path',
                                domReady: './libs/require/domReady',
                                // namespace that aggregate core classes that are in frequent use
                                Boiler: './app/core/_boiler_',
                                //Framework
                                jquery: './libs/jquery/jquery-min',
                                underscore: './libs/underscore/underscore-min',
                                backbone: './libs/backbone/backbone-min',
                                localforage: './libs/localforage/localforage',
                                localforagebackbone: './libs/localforage/localforage.backbone',
                                bootstrap: './libs/boostrap/bootstrap.min',
                                bootstrapSelect: './libs/boostrap/bootstrap-select',
                                jqueryTap: './libs/jquery/jquery.tap',
                                //Helpers
                                templates: './app/core/templates-handler',
                                dataLayer: './app/core/data-abstraction',
                                shim: {
                                    jquery: {
                                        exports: ['jQuery', '$']
                                    },
                                    underscore: {
                                        exports: '_'
                                    },
                                    backbone: {
                                        //These script dependencies should be loaded before loading
                                        //backbone.js
                                        deps: ['underscore', 'jquery'],
                                        //Once loaded, use the global 'Backbone' as the
                                        //module value.
                                        exports: 'Backbone'
                                    },
                                    localforagebackbone: {
                                        deps: ['localforage']
                                    },
                                    bootstrap: {
                                        deps: ['jquery']
                                    },
                                    bootstrapSelect: {
                                        deps: ['jquery', 'bootstrap']
                                    }
                                }
                            }
                        }
                    }
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
            },
            dev: { // Target
                options: { // Target options
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
                files: ['OWE/scss/**'],
                tasks: ['sass:dev']
            },
            prepbrowser: {
                files: ['OWE/www/**'],
                tasks: ['cordovacli:prepare_browser']
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
                        'cordova-plugin-camera',
                        'com.msopentech.websql',
                        'com.risingj.cordova.livetiles',
                        'de.appplant.cordova.plugin.local-notification',
                        'com.kolwit.updatelivetile'
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
                        'cordova-plugin-camera',
                        'com.msopentech.websql',
                        'com.risingj.cordova.livetiles',
                        'de.appplant.cordova.plugin.local-notification',
                        'com.kolwit.updatelivetile'
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
                    platforms: ['browser']
                }
            },
            build_browser: {
                options: {
                    command: 'build',
                    platforms: ['browser']
                }
            },
            prepare_browser: {
                options: {
                    command: 'prepare',
                    platforms: ['browser']
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
