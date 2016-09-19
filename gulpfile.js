
const gulp = require('gulp')
const markdownPdf = require('gulp-markdown-pdf')

gulp.task('default', function () {
  return gulp.src('./content.md')
    .pipe(markdownPdf())
    .pipe(gulp.dest('.'))
})
