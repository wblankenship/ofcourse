var UserCoursesChild_SingleCourseView = Backbone.View.extend({
  defaultLocation: ".oc-userCourses-courseContainer",
  template: JADE.userCoursesDiv,
  initialize: function(opts){
    var info = {title: this.model.get('title'),
                number: this.model.get('number'),
                section: this.model.get('section')
               }
    this.setElement(this.template(info))
    radio.on('unrender:UserCoursesChild_SingleCourseView', this.unrender, this)
    radio.on('render:UserCoursesChild_SingleCourseView', this.render, this)
    radio.on('unrender', this.unrender, this)
    radio.on('unrender:page', this.unrender, this)
  },
  events: {
    "click" : "onclick"
  },
  render: function(location) {
    var location = location || this.defaultLocation
    $(location).append(this.$el)
    return this;
  },
  unrender: function() {
    radio.off(null,null,this)
    this.$el.remove()
  },
  onclick: function() {
    App.course = this.model
    App.courseEvents.cid = this.model.get('id')
    radio.trigger('open:course')
  }
});

