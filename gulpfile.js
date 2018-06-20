/* jshint esversion: 6 */

const gulp = require('gulp'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify-es').default,
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync'),
    uncss = require('gulp-uncss'),
    pug = require('gulp-pug');

let reload = browserSync.reload;

// gulp.task('limpiar', () => {
//     return del([
//        'dist/**/*',
//     ]);
// });

gulp.task('copyHtml', () => {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('optimizarImagen', () =>
    gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
);

gulp.task('sass', () => {
    gulp.src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(sass({
            outputStyle: 'expanded',
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano({
            core: true
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('scripts', () => {
    // Aquí se añaden todos los scripts de JS, en el orden que se desee que se combinen, uglify() no admite el uso de let o const. 
    gulp.src([
            'src/js/script.js'
        ])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('bs-reload', () => {
    browserSync.reload();
});

gulp.task('browser-sync', () => {
    browserSync.init(['dist/css/*.css', 'dist/js/*.js', 'dist/*.html'], {
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('pug', () => {
    gulp.src('src/pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./dist'))
        .on('end', reload);
});

gulp.task('uncss', () => {
    return gulp.src('dist/css/estilos.min.css')
        .pipe(uncss({
            html: ['dist/**/*.html']
        }))
        .pipe(gulp.dest('dist/css'));
});

// En caso de estar activada, la tarea 'limpiar' debe ser la primera en el array 'gulp.task('default',[...])'
gulp.task('default', ['copyHtml', 'optimizarImagen', 'sass', 'browser-sync', 'pug'], () => {
    gulp.watch('src/*.html', ['copyHtml']);
    gulp.watch('src/img/*', ['optimizarImagen']);
    gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['sass']);
    gulp.watch(['src/pug/*.pug', 'src/pug/**/*.pug'], ['pug']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch(['src/*.html'], ['bs-reload']);
});
