
const gulp = require('gulp')
const del = require('del')

const awspublish = require('gulp-awspublish')
const jimp = require('gulp-jimp')
const liveServer = require('gulp-live-server')
const markdown = require('gulp-markdown')
const markdownPdf = require('gulp-markdown-pdf')
const rename = require('gulp-rename')
const wrap = require('gulp-wrap')


const paths = {
  content: './content.md',
  assets: './assets',
  images: './assets/images',
  www: './www'
}

function cleanImages() {
  return del(`${paths.images}/**/*.png`)
}

function formatImages() {
  return gulp.src(`${paths.images}/**/*.png`)
    .pipe(jimp({'': {
      type: 'jpg',
      quality: 80,
      resize: {width: 600}
    }}))
    .pipe(gulp.dest(paths.images))
}

function cleanRoot() {
  return del(paths.www)
}

function linkAssets() {
  return gulp.src(`${paths.assets}/**/*`)
    .pipe(gulp.symlink(paths.www))
}

function html() {
  return gulp.src(paths.content)
    .pipe(markdown())
    .pipe(rename('./index.html'))
    .pipe(wrap('<html><head></head><body><%= contents %></body></head>'))
    .pipe(gulp.dest(paths.www))
}

function serve(done) {
  let server = liveServer.static(paths.www)
  server.start()
  gulp.watch(paths.content, html)
  gulp.watch(paths.www).on('change', (path) => {
    server.notify({type: 'change', path})
  })
  done()
}

function publish() {
  let config = require('./aws.json')
  let headers = {
    'Cache-Control': 'no-cache'
  }
  let publisher = awspublish.create({
    region: 'eu-west-1',
    params: {
      Bucket: 'yai.kandu.manual.juriejan.co'
    },
    accessKeyId: config.key,
    secretAccessKey: config.secret
  })
  return gulp.src(`${paths.www}/**/*`, {follow: true})
    .pipe(awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(awspublish.reporter())
}

gulp.task('pdf', function () {
  return gulp.src(paths.content)
    .pipe(markdownPdf({cssPath: './print.css'}))
    .pipe(gulp.dest('.'))
})

gulp.task('format', gulp.series(formatImages, cleanImages))
gulp.task('build', gulp.series(html, linkAssets))
gulp.task('publish', gulp.series('build', publish))
gulp.task('default', gulp.series(cleanRoot, 'build', serve))
