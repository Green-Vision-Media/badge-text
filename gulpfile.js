import gulp from 'gulp';
import rename from 'gulp-rename';
import terser from 'gulp-terser';

function scripts() {
    return gulp
        .src('./src/*.js')
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./public'));
}

gulp.task('default', gulp.parallel(scripts));
