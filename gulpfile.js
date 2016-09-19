
const gulp = require('gulp')

const clean = require('gulp-clean')
const jimp = require('gulp-jimp')
const liveServer = require('gulp-live-server')
const markdown = require('gulp-markdown')
const markdownPdf = require('gulp-markdown-pdf')
const rename = require('gulp-rename')
const wrap = require('gulp-wrap')

const paths = {
  content: './content.md',
  images: './images',
  www: './www'
}

function cleanImages () {
  return gulp.src(`${paths.images}/**/*.png`).pipe(clean())
}

function formatImages () {
  return gulp.src(`${paths.images}/**/*.png`)
    .pipe(jimp({'': {type: 'jpg', quality: 80}}))
    .pipe(gulp.dest('./images'))
}

function cleanRoot () {
  return gulp.src(paths.www).pipe(clean())
}

function linkImages () {
  return gulp.src(`${paths.images}/**/*`)
    .pipe(gulp.symlink(`${paths.www}/images`))
}

function html () {
  return gulp.src(paths.content)
    .pipe(markdown())
    .pipe(rename('./index.html'))
    .pipe(wrap('<html><head></head><body><%= contents %></body></head>'))
    .pipe(gulp.dest(paths.www))
}

function serve (done) {
  let server = liveServer.static(paths.www)
  server.start()
  gulp.watch(paths.content, html)
  gulp.watch(paths.www).on('change', (path) => {
    server.notify({type: 'change', path})
  })
  done()
}

gulp.task('pdf', function () {
  return gulp.src(paths.content)
    .pipe(markdownPdf({cssPath: './print.css'}))
    .pipe(gulp.dest('.'))
})

gulp.task('format', gulp.series(formatImages, cleanImages))
gulp.task('build', gulp.series(html, linkImages))
gulp.task('default', gulp.series(cleanRoot, 'build', serve))
