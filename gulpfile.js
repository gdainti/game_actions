var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var cache = require('gulp-cache');
var del = require('del');
var nodemon = require('gulp-nodemon');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');

var paths = {
    src: {
        scripts: ['src/js/*.js'],
        styles: 'src/scss/**/*.scss',
        mainScss: 'src/scss/main.scss',
        images: 'src/img/**/*.{png,jpg,gif}',
        html: 'src/html/*.html'
    },
    public: {
        scripts: 'js/',
        styles: 'css/',
        images: 'img/',
        html: './'
    }
};

// compile scss
gulp.task('styles', function () {
    gulp.src(paths.src.mainScss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(rename({basename: 'style',suffix: '.min'}))
        .pipe(gulp.dest(paths.public.styles))
        .pipe(livereload());
});

// concat, minify js
gulp.task('scripts', function(){
    gulp.src(paths.src.scripts)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat("script.js"))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.public.scripts))
        .pipe(livereload());
});

// html
gulp.task('html', function(){
    gulp.src(paths.src.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.public.html))
        .pipe(livereload());
});

// html
gulp.task('images', function(){
    gulp.src(paths.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.public.images))
        .pipe(livereload());
});

/*var nodemonOptions = {
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    verbose: false,
    ignore: [],
    watch: ['server.js']
};

gulp.task('server', function () {
    nodemon(nodemonOptions)
        .on('restart', function () {
            console.log('restarted!')
        });
});*/

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.src.styles, ['styles']);
    gulp.watch(paths.src.scripts, ['scripts']);
    gulp.watch(paths.src.images, ['images']);
    gulp.watch(paths.src.html, ['html']);
});

gulp.task('default', [/*'server',*/ 'html',  'styles', 'scripts', 'images', 'watch']);

