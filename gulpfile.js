// Require variables

const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-imagemin');

// Folder variables

const styleSRC = 'src/scss/style.scss';
const styleDIST = './dist/css/';
const styleWatch = 'src/scss/**/*.scss';

const jsFolder = 'src/js/'
const jsSRC = 'app.js';
const jsDIST = './dist/js/';
const jsWatch = 'src/js/**/*.js';
const jsFILES = [jsSRC];

const imageSRC = 'src/images/*.*';
const imageDIST = './dist/images/';
const imageWatch = 'src/images/**/*.*'; 

// Tasks

const css = (done) => {
    gulp.src( styleSRC )
        .pipe( sourcemaps.init() )
        .pipe( sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }) )
        .on( 'error', console.error.bind(console) )
        .pipe( autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }) )
        .pipe( rename( { suffix: '.min' } ))
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( styleDIST ) )
    done();
}

const js = (done) => {
    jsFILES.map( (entry) => {
        return browserify({
            entries: [jsFolder + entry]
        })
            .transform( babelify, {presets: ['@babel/preset-env']} )
            .bundle()
            .pipe( source( entry ) )
            .pipe( rename( {
                extname: '.min.js'
            } ) )
            .pipe( buffer() )
            .pipe( sourcemaps.init({ loadMaps: true }) )
            .pipe( uglify() )
            .pipe( sourcemaps.write( './' ) )
            .pipe( gulp.dest( jsDIST ) )
        } );
    done();
}

const images = (done) => {
    gulp.src( imageSRC )
        .pipe( imagemin({ progressive: true, optimizationLevel: 5 }) )
        .pipe( gulp.dest( imageDIST ) )
    done();
}

const watch_files = () => {
    gulp.watch( styleWatch, css );
    gulp.watch( jsWatch, js );
    gulp.watch( imageWatch, images );
}

gulp.task('css', css);
gulp.task('js', js);
gulp.task('images', images);

gulp.task('default', gulp.series(css, js, images, watch_files));