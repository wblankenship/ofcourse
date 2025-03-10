function createCourseCollection() {
  var department = new Entry({id:"department", desc: "Department", name: "department"});
  var title = new Entry({id:"title", desc:"Title of Course", name:"title"});
  var number = new Entry({id:"number", desc:"Course Number", name:"number"});
  var section = new Entry({id:"section", desc:"Section Number", name:"section"});
  var start = new Entry({id:"start", desc:"Starting Date of Course", name:"start"});
  var end = new Entry({id:"end", desc:"Ending Date of Course", name:"end"});

  var createCourseFields = new Forms([
    department,
    title,
    number,
    section,
    start,
    end
  ]);

  return createCourseFields;
}
