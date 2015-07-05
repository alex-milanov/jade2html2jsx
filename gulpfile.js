"use strict";

var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('jade', function(done) {
	// TODO: get from config
	var YOUR_LOCALS = {};
	gulp.src('./jade/**/*.jade')
		.pipe(jade({
			locals: YOUR_LOCALS,
			pretty: true
		}))
		.pipe(gulp.dest('./html/'))
//		.pipe( livereload())
		.on('end',done)
});
