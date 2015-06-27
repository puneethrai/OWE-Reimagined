module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: "main.js",
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    // Default task(s).
    grunt.registerTask('default', ['requirejs']);
};