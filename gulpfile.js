
const gulp = require('gulp')

const clean = require('gulp-clean')
const jimp = require('gulp-jimp')
const markdownPdf = require('gulp-markdown-pdf')

gulp.task('clean', function () {
  return gulp.src('./images/**/*.png')
    .pipe(clean())
})

gulp.task('format', function () {
  return gulp.src('./images/**/*.png')
    .pipe(jimp({'': {type: 'jpg', quality: 80}}))
    .pipe(gulp.dest('./images'))
})

gulp.task('pdf', function () {
  return gulp.src('./content.md')
    .pipe(markdownPdf({cssPath: './print.css'}))
    .pipe(gulp.dest('.'))
})

gulp.task('default', gulp.series('format', 'clean', 'pdf'))
