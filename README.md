# fCC APIs and Microservices [Exercise Tracker](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker) Project

Project challenge for freeCodeCamp's APIs and Microservices Certification

This application primarily utilizes basic Node and Express.

## User Stories
* You can POST to `/api/users` with form data username to create a new user. The returned response will be an object with `username` and `_id` properties.
* You can make a GET request to `/api/users` to get an array of all users. Each element in the array is an object containing a user's `username` and `_id`.
* You can POST to `/api/users/:_id/exercises` with form data description, duration, and optionally date. If no date is supplied, the current date will be used. The response returned will be the user object with the exercise fields added.
* You can make a GET request to `/api/users/:_id/logs` to retrieve a full exercise log of any user. The returned response will be the user object with a log array of all the exercises added. Each log item has the description, duration, and date properties.
* A request to a user's log (`/api/users/:_id/logs`) returns an object with a count property representing the number of exercises returned.
* You can add from, to and limit parameters to a `/api/users/:_id/logs` request to retrieve part of the log of any user. from and to are dates in `yyyy-mm-dd` format. limit is an integer of how many logs to send back.



## Executing the application
** Requires own MongoDB collection URI and config due to `process.env['MONGO_URI']`
* git clone/download repo
* `cd` into local project directory
* configure `const MONGO_URI` for own db collection
* `npm install`
* `npm start`
* Open [localhost:3000](http://localhost:3000) in browser (default port in settings)

## Replit Example
[Spotlight](https://replit.com/@allemandi/fCC-Exercise-Tracker-Project)

The [demo can be found here](https://fCC-Exercise-Tracker-Project.allemandi.repl.co)