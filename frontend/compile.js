var Jade = require('./compile/jade.js')
var Node = require('./compile/node.js')

var glob = require('glob')
var color = require('cli-color')
var once = require('once')
var async = require('async')
var path = require('path')
var fs = require('fs-extra')
var minify = require('node-minify')
var browserify = require('browserify')
var exec = require('child_process').exec

/**
 * Folders that need to be generated if they don't already exist
 */
var folders = [
  path.join(__dirname,"jade"),
  path.join(__dirname,"js"),
  path.join(__dirname,"css"),
  path.join(__dirname,"node"),
  path.join(__dirname,"build")
]

/**
 * globs and useful file/folder names
 */
var outputDir = path.join(__dirname,"build") // Where final files go
var jadeFiles = path.join(__dirname,"jade","*.jade") //glob
var jsFiles = path.join(__dirname,"js","**/*.js") //glob
var nodeFiles = path.join(__dirname,"node","*.js")
var nodeOutput = path.join(__dirname,"js","node.js")
var cssFiles = path.join(__dirname,"css","*.css")
var minifiedJS = path.join(outputDir,"min.js")
var jadeJSON = path.join(__dirname,"js","jade.js")
var minifiedCSS = path.join(outputDir,"min.css")
var isDev = (process.env.NODE_ENV || "dev") === "dev"

// infos object allows us to print nice little columns
var infos = [
    "Creating Directories... ",
    "Building Jade JSON... ",
    "Saving Jade JSON... ",
    "Minifying JS Files... ",
    "Minifying CSS Files... ",
    "Cleaning Up Generated Files... "
]
infos.index = 0
infos.width = function() {
  var max = 0
  infos.forEach(function(v) {
    max = (max > v.length ? max : v.length)
  })
  return max
}()
infos.getNext = function() {
  var val = infos[infos.index++]
  while(val.length < infos.width) val+=" "
  return val
}


async.waterfall([
  function makeBuildDirectory(cb) {
    log("green","STRT","Beginning Build Script",true)
    log("yellow","INFO",infos.getNext())
    createDirs(folders,cb)
  },
  function buildJadeJSON(cb) {
    success()
    log("yellow","INFO",infos.getNext())
    new Jade().generateJade(jadeFiles,cb)
  },
  function saveJadeJSON(contents,cb) {
    success()
    log("yellow","INFO",infos.getNext())
    fs.writeFile(jadeJSON,"var JADE = "+JSON.stringify(contents),cb)
  },
  function minifyJS(cb) {
    success()
    log("yellow","INFO",infos.getNext())
    new minify.minify({
      type: (isDev ? 'no-compress' : 'uglifyjs'),
      fileIn: jsFiles,
      fileOut: minifiedJS,
      callback: cb
    })
  },
  function minifyCSS(min,cb) {
    success()
    log("yellow","INFO",infos.getNext())
    new minify.minify({
      type: (isDev ? 'no-compress' : 'clean-css'),
      fileIn: cssFiles,
      fileOut: minifiedCSS,
      callback: cb
    })
  },
  function cleanupFiles(min,cb) {
    success()
    log("yellow","INFO",infos.getNext())
    cleanup(cb)
  },
],function(e) {
  if(e) return fail(e)
  success()
  log("green","DONE","All files written to: "+color.green(outputDir),true)
})

function cleanup(cb) {
    fs.unlink(nodeOutput,function(){
      fs.unlink(jadeJSON,function(){
        cb()
      })
    })
}

function createDirs(folders,cb) {
  /**
   * async.each will run the first function on all elements of the folders
   * array IN PARALLEL (at the same time). This is super fast. When all
   * functions have finished running, it will call the second function.
   * It also calls the second function on error.
   */
  async.each(
    folders,
    function(folder,cb) {
      fs.mkdirs(folder,function(e) {
        if(e && e.code !== "EEXIST") return cb(e)
        cb()
      })
    },
    cb
  )
}

var fail = once(function(e) {
  process.stdout.write("["+color.red("FAIL")+"]\n")
  cleanup(function(){
    console.log(e)
    process.exit(1)
  })
})

function log(c,tag,text,newline) {
  process.stdout.write("["+color[c](tag)+"] "+text+(newline ? "\n" : ""))
}

function success() {
  process.stdout.write("["+color.green("OK!")+"]\n")
}
