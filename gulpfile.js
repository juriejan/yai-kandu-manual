
const gulp = require('gulp')

const clean = require('gulp-clean')
const jimp = require('gulp-jimp')
const liveServer = require('gulp-live-server')
const markdown = require('gulp-markdown')
const markdownPdf = require('gulp-markdown-pdf')
const rename = require('gulp-rename')

gulp.task('cleanImages', function () {
  return gulp.src('./images/**/*.png')
    .pipe(clean())
})

gulp.task('clean', function () {
  return gulp.src('./www')
    .pipe(clean())
})

gulp.task('formatImages', function () {
  return gulp.src('./images/**/*.png')
    .pipe(jimp({'': {type: 'jpg', quality: 80}}))
    .pipe(gulp.dest('./images'))
})

gulp.task('copyImages', function () {
  return gulp.src('./images/**/*')
    .pipe(gulp.dest('./www/images'))
})

gulp.task('pdf', function () {
  return gulp.src('./content.md')
    .pipe(markdownPdf({cssPath: './print.css'}))
    .pipe(gulp.dest('.'))
})

gulp.task('html', function () {
  return gulp.src('./content.md')
    .pipe(markdown())
    .pipe(rename('./index.html'))
    .pipe(gulp.dest('./www'))
})

gulp.task('serve', function (done) {
  let server = liveServer.static('./www')
  server.start()
  done()
})

gulp.task('build', gulp.series('html', 'copyImages'))
gulp.task('default', gulp.series('clean', 'build', 'serve'))
