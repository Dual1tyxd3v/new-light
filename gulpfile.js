const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webP = require("gulp-webp");
const jsMin = require("gulp-jsmin");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

const imagz = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: false}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

const webPIMG = () => {
  return gulp.src("source/img/*.{jpg,png}")
    .pipe(webP({quality: 90}))
    .pipe(gulp.dest("build/img"));
}

const js = () => {
  return gulp.src("source/js/*.js")
    .pipe(gulp.dest("build/js"))
    .pipe(jsMin())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"));
}

const copyHTML = () => {
  return gulp.src("source/*.html")
  .pipe(gulp.dest("build"));
}

const copyFonts = () => {
  return gulp.src("source/fonts/*.{woff,woff2}")
  .pipe(gulp.dest("build/fonts"));
}

const copyWebp = () => {
  return gulp.src("source/img/*.webp")
  .pipe(gulp.dest("build/img"));
}

const build = () => {
  styles();
  js();
  imagz();
  webPIMG();
  copyWebp();
  copyHTML();
  copyFonts();
}

exports.build = build;

exports.imagz = imagz;
// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher, imagz, build
);
