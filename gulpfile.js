const gulp = require('gulp'),
    rename = require('gulp-rename'),
    terser = require('gulp-terser');

function scripts() {
    return gulp
        .src('./src/*.js')
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./public'));
}

gulp.task('default', gulp.parallel(scripts));
