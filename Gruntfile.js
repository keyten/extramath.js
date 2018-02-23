var banner = `/* Extramath.js by Keyten
 * Yet another math lib.
 * https://github.com/keyten/extramath.js
*/`

module.exports = function (grunt) {
	grunt.initConfig({
		uglify: {
			main: {
				files: {
					'./build/extramath.min.js': './build/extramath.js'
				}
			}
		},

		concat: {
			basic: {
				src: ['./src/extramath.js', './src/**/*.js'],
				dest: './build/extramath.js',
				banner: banner
			}
		},

		watch: {
			main: {
				files: 'src/**/*.js',
				tasks: 'concat'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['concat', 'uglify']);
}