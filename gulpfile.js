const {series, src, dest} = require('gulp');
const pump = require('pump');

const postcss = require('gulp-postcss');
const zip = require('gulp-zip');

// postcss plugins
const easyimport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function handleError(done) {
    return function (err) {
        if (err) {
            console.log(err);
        }
        return done(err);
    };
};

function css(done) {
    pump([
        src('assets/css/main.css', {sourcemaps: true}),
        postcss([
            easyimport,
            autoprefixer(),
            cssnano()
        ]),
        dest('assets/built/', {sourcemaps: '.'})
    ], handleError(done));
}

function zipper(done) {
    const filename = require('./package.json').name + '.zip';

    pump([
        src([
            '**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**',
            '!yarn-error.log'
        ]),
        zip(filename),
        dest('dist/')
    ], handleError(done));
}

const build = series(css);

exports.build = build;
exports.zip = series(build, zipper);