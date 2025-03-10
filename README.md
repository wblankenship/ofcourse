ofcourse-backend
================

[ ![Codeship Status for wblankenship/ofcourse-backend](https://www.codeship.io/projects/bf3d7f40-2fd4-0132-3e73-2e3607fd60d8/status)](https://www.codeship.io/projects/39654)

The backend REST server for ofCourse

# Local Dev

## Creating New Model

When creating a new model.
  1.) Add the model to the array in v1/db/init.js
  2.) Create a copy of model in v1/models with the types declared (see current models for example)

## Checking out the source code

```
git clone --recursive git@github.com:wblankenship/ofcourse-backend backend
cd backend
npm install
```

## Database

We use postgresql. The easiest way to get up and running is to use the docker postgres container:

```
docker run -dp 5432:5432 postgres:9.3
```

At this point you have a default docker setup running on port 5432 of your local host. The default username is postgres as is the default database.

You will also need redis for the session keys. To do this simply run:

```
docker run -dp 6379:6379 redis:2.8.12
```


test user registration:
```
  curl -X POST --header "Content-Type: application/json" -d '{"firstName":"testfirst","lastName":"testlast","university":"siu","id":1234,"email":"testemail@mytestemail.com"}' localhost:5000/v1/user
```

test create course:
```
  curl -X POST --header "Content-Type: application/json" -d '{"university":1,"id":11228,"title":"Theory of Something","location":"test location","instructor":"some asshole","semester":"fall","department":"TTT","number":491,"section":112,"start":"20150201","end":"20150228"}' localhost:5000/v1/user
```

insert universities into database:
```  
  insert into universities (name,abbreviation,state,city) values
  ('Southern Illinois University','SIU','IL','Carbondale'),
  ('The Delaware One','TDO','DE','Delewareville')
```


sample Events:
set userid to your App.user.id 
```
  insert into courses (university, title, number, section, department) values 
  (1, 'test course 1', '1', '001', 1);
  insert into parent_events (cid,start,"end") values
  (1,'2014-11-01','2014-11-29');
  insert into events (userid, title, parentid, courseid, start, "end",type) values 
  (1,'Test Event 1',1,1,'2014-11-07','2014-11-07',1),(1,'Test Event 2',1,1,'2014-11-08','2014-11-08',1),
  (1,'Test Event 3',1,1,'2014-11-09','2014-11-09',1),(1,'Test Event 4',1,1,'2014-11-10','2014-11-10',1),
  (1,'Test Event 5',1,1,'2014-11-11','2014-11-11',1),(1,'Test Event 6',1,1,'2014-11-12','2014-11-12',1),
  (1,'Test Event 7',1,1,'2014-11-13','2014-11-14',1),(1,'Week Long Event Test',1,1,'2014-11-01','2014-11-07',1);
  insert into courses (university, title, number, section, department) values 
  (1, 'test course 2', '5', '002', 1);
  insert into courses (university, title, number, section, department) values 
  (1, 'test course 3', '6', '003', 1);
  insert into parent_events (cid,start,"end") values
  (5,'2014-11-01','2014-11-29');
    insert into parent_events (cid,start,"end") values
  (6,'2014-11-01','2014-11-29');
   insert into events (userid, title, parentid, courseid, start, "end",type) values 
  (1,'Test Event 1',1,5,'2014-11-07','2014-11-07',1),(1,'Test Event 2',1,6,'2014-11-08','2014-11-08',1),
  (1,'Test Event 3',1,5,'2014-11-09','2014-11-09',1),(1,'Test Event 4',1,6,'2014-11-10','2014-11-10',1),
  (1,'Test Event 5',1,5,'2014-11-11','2014-11-11',1),(1,'Test Event 6',1,6,'2014-11-12','2014-11-12',1),
  (1,'Test Event 7',1,5,'2014-11-13','2014-11-14',1),(1,'Week Long Event Test',1,6,'2014-11-01','2014-11-07',1);
```

sample Courses:
```
 insert into courses (university, title, number, section) values (1, 'test course 1', '1', '001'),
 (1, 'test course 2', '2', '002'),(1, 'test course 5', '5', '005'),
 (1, 'test course 3', '3', '003'),(1, 'test course 6', '6', '006'),
 (1, 'test course 4', '4', '004'),(1, 'test course 7', '7', '007')
```

clear database:
```
  drop table courses cascade; drop table events cascade; drop table fb cascade; drop table parent_events cascade; 
  drop table universities cascade; drop table users cascade; drop table course_user cascade; drop schema public cascade;create schema public;
```

 
 
## Running the tests

*REMEMBER* running the tests requires postgres to be running on your localhost. Refer to the section above.

To run the tests, simply:

```
npm test
```

## Running the code

*REMEMBER* running the code requires postgres to be running on your localhost. Refer to the section above.

```
node start.js
```

 _start.js_ will start the server, compile the server, and then watch for changes in the filesystem. When there is a change, it will recompile the server.


