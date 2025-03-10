var router = module.exports = require('express').Router()

var bodyParser = require('body-parser')
var passport = require('passport')
var later = require('later')
var pg = require('pg')
var async = require('async')
var logger = require('../../logger')

var db = require('../db')
var models = require('../models')

router.use(bodyParser.json())
router.use(db.session)
router.use(passport.initialize())
router.use(passport.session())

router.post('/',function(req,res) {
  if(!req.user || !req.user.profile || !req.user.profile.id) return res.status(401).json("Please login")
  var course = new models.Course()
  if(!course.set(req.body,{validate:true})) {
    return res.status(400).json({e:course.validationError})
  }
  async.waterfall([
    function getUserUniversity(cb){
      db.user.getUniversityByUserID(req.user.profile.id,function(e,university) {
        //dont do this, remove this for production build, gives attackers too much info
        if(e) return cb(e, 500, "Error getting University from User data")
        if(!university) return cb(e, 400, "No University found for User")
        course.set('university',university)
        return cb(e,course)
      })
    },
    function addUserEvent(course, cb){
      // We should really start a transaction up here.
      // In the event anything fails, we should rollback changes and retry?
      db.user.addCourse(course,req.user.profile.id,function(e,cid){
        return cb(e,cid)
      })
    },
    function addUserParentEvent(cid,cb){
      var parent = new models.ParentEvent()
      parent.set(course.toJSON())
      parent.set('cid',cid)
      parent.set('cron', JSON.stringify(course.get('events')))
      db.user.addParentEvent(parent, function(e,pid){
        return cb(e, cid, pid)
      })
    },
    function insertEvents(cid, pid, cb){
      // For each cron and duration
      var events = req.body.events
      async.each(events, function(item, cb){
        var sched = later.parse.cron(item.cron)
        var courseStart = new Date(course.attributes.start)
        var courseEnd = new Date(course.attributes.end)
        var dates = later.schedule(sched).next(1092,courseStart,courseEnd)
        // We need to create all physical dates that are generated from it
        async.each(dates, function(date, cb){
          var courseEvent = new models.Event({
            userid: req.user.profile.id,
            parentid: pid,
            courseid: cid,
            title: course.attributes.title,
            start: date.toJSON(),
            end: new Date(date.setSeconds(date.getSeconds() + item.duration)).toISOString(),
            type: 0
          })
          var insert = db.sql.insert(models.Event,courseEvent.toJSON())
          console.log(JSON.stringify(insert))
          db.db(insert.str,insert.arr, cb)
        },cb)
      },function(e) {
        return cb(e,pid)
      })
    }
  ],
  function(e,pid){
    if(e) {
      logger.error('create course error ', e)
      return res.status(500).end(e.stack+"\n"+JSON.stringify(e))
    }
    res.write(JSON.stringify({id:pid}))
    return res.end()
  })
})

//CourseCollection
router.get('/courses',function(req,res) {
  if(!req.user || !req.user.profile || !req.user.profile.id) return res.status(401).json("Please login")
  db.user.get(req.user.profile.id,function(e,user) {
    if(e) {
      logger.error('database error getting user', e)
      return res.status(500).json(e)//dont do this, remove this for production build, gives attackers too much info
    }
    if(!user) res.status(500).json('user not found')
    db.user.getCoursesByUniversity(user.university,function(e,courses) {
      if(e) {
		logger.error('database error getting courses', e)
		return res.status(500).json(e)//dont do this, remove this for production build, gives attackers too much info
      }
      if(!courses) res.status(500).json('user not found')
      res.status(200).json(courses)
    })
  })
})
