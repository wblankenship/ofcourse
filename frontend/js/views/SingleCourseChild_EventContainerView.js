var SingleCourseChild_CourseEventsContainerView = Backbone.View.extend({
    defaultLocation: ".oc-viewCourse-pageWrapper",
    template: JADE.userCourseEventContainer,
    initialize: function(opts){
      this.setElement(this.template())
      radio.on('unrender:SingleCourseChild_CourseEventsContainerView', this.unrender, this)
      radio.on('render:SingleCourseChild_CourseEventsContainerView', this.render, this)
      radio.on('unrender', this.unrender, this)
      radio.on('unrender:page', this.unrender, this)
      this.listenTo(this.collection, 'add', this.rerender)
      this.listenTo(this.collection, 'remove', this.rerender)
      this.listenTo(this.collection, 'reset', this.rerender)
      return this;
    },
    render: function(location) {
      var location = location || this.defaultLocation
      $(location).append(this.$el)
      this.renderCourseViews()
      return this;
    },
    unrender: function() {
      this.stopListening()
      radio.off(null, null, this)
      this.$el.remove()
      return this
    },
    renderCourseViews: function (){
      for(var i = 0; i < this.collection.length; i++){
        new SingleCourseChild_SingleEventView({radio: radio,
                                 model: this.collection.at(i)
                                }).render()
      }
    },
    rerender: function() {
      radio.trigger('unrender:SingleCourseChild_SingleEventView')
      this.renderCourseViews()
    }
});
