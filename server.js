require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require('mongoose');



// Basic Configuration
const port = process.env.PORT || 3000;


app.use(cors())
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//MongoDB setup
//currently, the MONGO_URI is a private environment variable linked to current db collection of this repl's owner (me).
// the Mongo URI can be easily replaced by string text following this convention: 'mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<db-name>?retryWrites=true&w=majority'
const MONGO_URI = process.env['MONGO_URI'];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose schema and model setup
const SCHEMA = mongoose.Schema;

const USER_SCHEMA = new SCHEMA({
    username: {type: String, required: true},
    log: [{
      description: String,
      duration: Number,
      date: Date
    }]
  });

//the db collection name is "Url"
const User = mongoose.model("User", USER_SCHEMA);

// parse the data coming from POST requests
// middleware to handle urlencoded data is returned by bodyParser.urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// POST request to create new user. If new, create user in db and return res.json of username and _id
// if not new, return User Exists
app.post('/api/users', (req,res) => {

   let usernameBod = req.body['username'];

   User.findOne({username: usernameBod}, (err, data) => {

     if(err) return console.log(err);
      
      //if the data found is null (meaning that it does not exist within record)
     if(data == null){

        var newUser = new User({
          username: usernameBod
        })

        // save the newRecord in Url
        newUser.save((err, data) => {

          if (err) return console.error(err);
          
          return res.json({
            username: usernameBod,
            _id: data['_id']
          })

        })
      }
      //else if exists within record
      else {
        return res.send("User Exists")
      }
    })
})



// GET request to return list of all users
app.get("/api/users", (req, res) => {

  //use find(), object filtered by username and _id
  User.find({}, "username _id", (err, data) => {

    res.json(data);
  });
});


// POST request with form data description, duration, and optionally date. If no date is supplied, the current date will be used. The response returned will be the user object with the exercise fields added.
app.post('/api/users/:_id/exercises', (req, res) => {
  
  //by default, date declared to today's date
  let trueDate = new Date().toDateString();

  //if req.body contains a date value, change date now to the date declared 
  if(req.body['date']){
    trueDate = new Date(req.body['date']).toDateString()
  }


  //tests only pass with params['_id'] rather than req.body[':_id']

  let idParam = req.params['_id'];

  //find if there is an id existing in db of the stated id
  User.findOne({_id: idParam}, (err, data) => {
    if(err) return console.log(err);

    //if id does not exist in db documents
    if(data == null) {
      return res.send("Invalid ID");
    }
    else{

      //define the body variables from within the form
      let descBod = req.body['description'];
      let durBod = Number(req.body['duration']);

      //newLog object format
      let newLog = {
        description: descBod,
        duration: durBod,
        date: trueDate
      }

      // push newLog entry to document entry, within log object
      data.log.push(newLog);
      
      //save down data to db
      data.save();

      //return json object according to format
      res.json({
        username: data['username'],
        _id: data['_id'],
        description: descBod,
        duration: durBod,
        date: trueDate
      })
    }

  })
})



// GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
// log item has the description, duration, and date properties.
app.get("/api/users/:_id/logs", (req, res) => {

  //define idParam as the id in url
  let idParam = req.params['_id'];

  //use find(), object filtered by username and _id
  User.findById(idParam, (err, data) => {

    if (err) return console.log(err);

    //if data is false (id cannot be found in User database)
    if(!data)
    {
      return res.send("id does not exist")

    }
    //else, if data is true (id is found in User)
    else {
    
    //by default, set qFrom as a date starting from 0, and get time for comparison format
    let qFrom = new Date(0).getTime();

    //Date.now() faster than new Date.getTime();
    let qTo = Date.now();

    //if qFrom actually exists in query, define it as declared in ? query
    if(req.query.from){
      qFrom = new Date(req.query.from).getTime();
    }
    
    //if qTo actually exists in query, define it as declared in ? query
    if(req.query.to){
      qTo = new Date(req.query.to).getTime();
    }


    //filter data.log which is currently in array format by date
    // return log array where date is greater than qFrom and less than qTo
    data.log = data.log.filter(x => (x.date >= qFrom && x.date <= qTo))

    //define limit variable
    let limit = req.query.limit;
    
    //if a query for limit exists, slice to the limit number provided
    if(limit){
      data.log = data.log.slice(0, limit);
    }

    //map data.log according to specific format
    trueLog = data.log.map(x => ({
      description: x.description,
      duration: x.duration,
      date: new Date(x.date).toDateString()
    }))

    //create new object, where format is correct, count included
    trueObj = {
    _id: idParam,
    username: data.username,
    count: trueLog.length,
    log: trueLog
    }

    //return trueObj
    return res.json(trueObj);

    }
  });
});



const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
