
const gulp = require('gulp')
const del = require('del')

const jimp = require('gulp-jimp')
const liveServer = require('gulp-live-server')
const markdown = require('gulp-markdown')
const markdownPdf = require('gulp-markdown-pdf')
const rename = require('gulp-rename')
const wrap = require('gulp-wrap')
const s3 = require('gulp-s3')


const paths = {
  content: './content.md',
  images: './images',
  www: './www'
}

function cleanImages () {
  return del(`${paths.images}/**/*.png`)
}

function formatImages () {
  return gulp.src(`${paths.images}/**/*.png`)
    .pipe(jimp({'': {
      type: 'jpg',
      quality: 80,
      resize: {width: 600}
    }}))
    .pipe(gulp.dest(paths.images))
}

function cleanRoot () {
  return del(paths.www)
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

function publish () {
  let config = require('./aws.json')
  return gulp.src(`${paths.www}/**/*`).pipe(s3(config))
}

gulp.task('pdf', function () {
  return gulp.src(paths.content)
    .pipe(markdownPdf({cssPath: './print.css'}))
    .pipe(gulp.dest('.'))
})

gulp.task('format', gulp.series(formatImages, cleanImages))
gulp.task('build', gulp.series(html, linkImages))
gulp.task('publish', gulp.series('build', publish))
gulp.task('default', gulp.series(cleanRoot, 'build', serve))
