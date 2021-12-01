const {dest, src, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const browserSync = require('browser-sync').create();
const del = require("del");
const babel = require('gulp-babel');
const concatenate = require('gulp-concat');
const exec = require('child_process').exec; // run command-line programs from gulp
var git = require('gulp-git');


// clean
async function clean(cb){
    await del('dist');
    cb();
}

// html
function html(cb){
    src("src/*.html")
    .pipe(dest('dist'))
    cb();
}

function img(cb){
    src("src/assets/img/*")
    .pipe(dest('dist/assets/img/'))
    cb();
}


//css
    /*
function css(cb){
    src('src/assets/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest("dist/assets/css"))
    cb();
}  
 */
function cssFA(cb){
    src('src/assets/vendors/fontawesome/font.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest("dist/assets/vendors/fontawesome/"))
    cb();
}

function css(cb){
    src('src/assets/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest("dist/assets/css/"))
    cb();
}

//fontawsome
function fas(cb){
    src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(dest('dist/assets/vendors/webfonts/'))
    cb();
}
exports.fas = fas;

  
function js(cb){
    src([
        //'src/assets/js/modules/index.js',
        'src/assets/js/main.js'

    ])
  //  .pipe(babel({
    //  presets: ['@babel/env']
    // }))
   
    .pipe(dest('dist/assets/js'));
    cb();
  
}

  function  gitAdd(cb){
      src('./*')
      .pipe(git.add());
      cb();
  }

  exports.gitAdd = gitAdd;

// server
function server(cb){
    browserSync.init({
        notify: false,
        open: false,
        online: false,
        server: {
            baseDir: "dist"
        }
    })
    cb();
}

function git(cb) {
    exec('git add . && git commit -m "netlify deploy" && git push')
    cb();
}

exports.default = git;

function watcher(cb){
    watch("src/*.html").on("change", series(html, browserSync.reload))
    watch("src/assets/js/*.js").on("change", series(js, browserSync.reload))
    watch("src/assets/sass/**/*.scss").on("change", series(css, browserSync.reload))
   

    cb();
}
exports.default = series(clean,img,parallel(html, css,js,cssFA,fas, server), watcher);