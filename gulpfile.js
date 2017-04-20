var babelify   = require('babelify'),
	browserify = require('browserify'),
	buffer     = require('vinyl-buffer'),
	connect    = require('gulp-connect'),
	gulp       = require('gulp'),
	pug       = require('gulp-pug'),
	nib        = require('nib'),
	source     = require('vinyl-source-stream'),
	stylus     = require('gulp-stylus'),
	uglify     = require('gulp-uglify');

gulp.task('browserify', function () {
	return browserify({
		entries: 'lib/js/proto.js'
	})
	.transform(babelify, {
		presets: ['es2015']
	})
	.bundle()
	.pipe(source('proto.min.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest('public/js'))
	.pipe(connect.reload());
});

gulp.task('pug', function() {
	return gulp.src('lib/pug/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('./public'))
		.pipe(connect.reload());

	setTimeout(function () {
		del(['./public/layout.html']);
	}, 2000);
});

gulp.task('stylus', function () {
	return gulp.src('lib/styl/styles.styl')
		.pipe(stylus({
			use: nib(),
			'include css': true,
			compress: true
		}))
		.pipe(gulp.dest('./public/css'))
		.pipe(connect.reload());
});

gulp.task('connect', function() {
	connect.server({
		root: 'public',
		host: 'http://proto-l',
		livereload: true
	});
});

gulp.task('watch', function () {
	gulp.watch('lib/js/**/*.js', ['browserify']);
	gulp.watch('lib/pug/**/*.pug', ['pug']);
	gulp.watch('lib/styl/**/*.styl', ['stylus']);
});

gulp.task('default', ['browserify', 'pug', 'stylus', 'watch', 'connect']);