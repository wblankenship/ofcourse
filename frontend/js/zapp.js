var test;
var Workspace = Backbone.Router.extend({
  routes:{
    "home": "home",
    "login" : "login",
    "register" : "register",
    "uniSelect" : "uniSelect",
    "calendar" : "calendar",
    "addCourse": "addCourse",
    "createCourse": "createCourse",
    "courses":"courses",
    "viewCourse":"viewCourse",
    "userAssignments" : "userAssignments"
  },
  'home': function(){
    radio.trigger('unrender:page')
    App.eventCollection.fetch({reset:true})
  },
  'login': function(){
    radio.trigger('unrender')
    this.loginView = new LoginView({radio: radio,formVals:loginCollection().toJSON()}).render()
  },
  'register': function(){
    radio.trigger('unrender')
    this.user = new UserModel()
    this.registerView = new FormView({radio: radio,formVals:registrationCollection().toJSON(), user:App.user}).render()
  },
  'uniSelect': function(){
  },
  'calendar': function(){
    radio.trigger('unrender:page getTaskbar');
    App.eventCollection = new EventCollection([])
    var calendarView = new CalendarView({radio: radio, collection: App.eventCollection})
      .render();
    App.eventCollection.fetch({reset:true})//not the most efficient way to populate collection, but needed because of calender.js events
  },
  'addCourse': function(){
    radio.trigger('unrender:page getTaskbar');
    var addCourseParentView = new AddCourseParentView({radio: radio,
                                                       collection: App.courses,
                                                       model: App.user
                                                      }).render()
    App.courses.fetch({reset:true})//not the most efficient way to populate collection
   },
  'createCourse':function(){
    radio.trigger('unrender:page getTaskbar')
    this.createCourseParentView = new CreateCourseParentView({collection: App.courses, 
                                                              radio: radio,
                                                              formVals:createCourseCollection().toJSON(),
                                                              model: App.user}).render()
  },
  'courses':function(){
    radio.trigger('unrender:page getTaskbar')
    App.courses.fetch({reset:true})
    var loadingView = new LoadingView({radio: radio}).render('body')
    
    App.courses.fetch({
      success: function () {

      var courseSearchParentView = new CourseSearchParentView({radio: radio}).render()
        radio.trigger('unrender:LoadingView')
      }
    })
  },
  'userAssignments':function(){
    radio.trigger('unrender:page getTaskbar')
    App.eventCollection.fetch({
      success: loadAssignments
    })
    App.userCourses.fetch({reset:true})
    function loadAssignments(){
      var userAssignments = new UserAssignmentsView({radio: radio, 
                                                     collection: App.eventCollection,
                                                     courses: App.userCourses})
        .render()
    }
  },
  'viewCourse':function(){
    radio.trigger('unrender:page getTaskbar')
    var course = new SingleCourseParentView({radio: radio,
                                             model: App.course,
                                             collection: App.courseEvents})
                                          .render()
    App.courseEvents.fetch()
  },
  'addAssignment': function(){
    App.userCourses.fetch({reset:true})
    var addAssignmentView = new AddAssignView({radio: radio, collection: App.userCourses})
      .render()
    console.log(App.userCourses)
  }
});

var App = App || {}
App.user = new UserModel()
App.user.fetch({
  success: init,
  error: init,
})

App.courses = new CourseCollection()
App.courseEvents = new CourseEventsCollection()
App.userCourses = new UserCourseCollection()

App.eventCollection = new EventCollection([])
App.eventCollection.fetch({reset:true})

var workspace = new Workspace({radio: radio});
Backbone.history.start();

function init() {
  if(!App.user.isLoggedIn()){
    console.log('zapp.js: user is not logged in')
    workspace.navigate('login', {trigger: true});
  }
  else if(App.user.isLoggedIn()){
    var taskbar = new TaskbarView({radio: radio, model: App.user})
    var sidebar = new SidebarView({radio: radio})
    
    radio.trigger('getTaskbar render:SidebarView')
    if(!App.user.hasUniversity()) {
      //TODO: remove these. they should not be hardcoded.
      console.log('zapp.js: user has no university')
      var siu = new UniversityModel({id:1,name:'Southern Illinois University',abbreviation:'SIU',state:'IL',city:'Carbondale',location:'Carbondale, IL'})
      var delaware = new UniversityModel({id:2,name:'The Delaware One',location:'Somewhere, DE'})
      var universityCollection = new UniversityCollection([siu,delaware]);

      var uniSelectView = new UniSelectView({radio: radio, collection: universityCollection})
      var popup = new PopupView({contains:uniSelectView})
      popup.render()
    }
  }
}
