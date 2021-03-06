// Load in dependencies
var gulp = require('gulp');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var phantomjssmith = require('phantomjssmith');
var yaml = require('js-yaml');
var spritesmith = require('../');

// Define our tasks
gulp.task('sprite', function () {
  // Collect png's from images folder and output a .png spritesheet and CSS classes
  // Alternative outputs include: SASS, Stylus, LESS, JSON
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    algorithm: 'binary-tree'
  }));
  spriteData.pipe(gulp.dest('path/to/output/'));
});

gulp.task('sprite-pipeline', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));

  // Pipe image stream through image optimizer and onto disk
  spriteData.img
    .pipe(imagemin())
    .pipe(gulp.dest('path/to/image/folder/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  spriteData.css
    .pipe(csso())
    .pipe(gulp.dest('path/to/css/folder/'));
});

gulp.task('sprite-algorithm', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.styl',
    algorithm: 'alt-diagonal'
  }));
  spriteData.pipe(gulp.dest('examples/algorithm/'));
});

gulp.task('sprite-engine', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.styl',
    engine: phantomjssmith
  }));
  spriteData.pipe(gulp.dest('examples/engine/'));
});

gulp.task('sprite-padding', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.styl',
    padding: 20 // Exaggerated for visibility, normal usage is 1 or 2
  }));
  spriteData.pipe(gulp.dest('examples/padding/'));
});

gulp.task('sprite-retina', function () {
  var spriteData = gulp.src('retina-images/*.png').pipe(spritesmith({
    // This will filter out `fork-2x.png`, `github-2x.png`, ... for our retina spritesheet
    //   The normal spritesheet will now receive `fork.png`, `github.png`, ...
    retinaSrcFilter: ['retina-images/*-2x.png'],
    imgName: 'sprite.png',
    retinaImgName: 'sprite-2x.png',
    cssName: 'sprite.styl'
  }));
  spriteData.pipe(gulp.dest('examples/retina/'));
});

gulp.task('sprite-handlebars-template', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    cssTemplate: 'handlebarsStr.css.handlebars'
  }));
  spriteData.pipe(gulp.dest('examples/handlebars-template/'));
});

gulp.task('sprite-handlebars-inheritance', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    cssTemplate: 'handlebarsInheritance.scss.handlebars'
  }));
  spriteData.pipe(gulp.dest('examples/handlebars-inheritance/'));
});

gulp.task('sprite-template-function', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.yml',
    cssTemplate: function (data) {
      // Convert sprites from an array into an object
      var spriteObj = {};
      data.sprites.forEach(function (sprite) {
        // Grab the name and store the sprite under it
        var name = sprite.name;
        spriteObj[name] = sprite;

        // Delete the name from the sprite
        delete sprite.name;
      });

      // Return stringified spriteObj
      return yaml.safeDump(spriteObj);
    }
  }));
  spriteData.pipe(gulp.dest('examples/template-function/'));
});

// Define common task for all
gulp.task('sprite-all', [
  'sprite',
  'sprite-pipeline',
  'sprite-algorithm',
  'sprite-engine',
  'sprite-padding',
  'sprite-retina',
  'sprite-handlebars-template',
  'sprite-handlebars-inheritance',
  'sprite-template-function'
]);
