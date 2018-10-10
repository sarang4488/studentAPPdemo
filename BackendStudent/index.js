//import the require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
app.set("view engine", "ejs");
var mysql = require("mysql");
var pool = require("./db");

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

var Users = [
  {
    username: "admin",
    password: "admin"
  }
];

//Route to handle Post Request Call
app.post("/login", function(req, res) {
  console.log("Inside Login Post Request");
  var username = req.body.username;
  var password = req.body.password;
  var sql =
    "SELECT *  FROM user WHERE username = " +
    mysql.escape(username) +
    "and password = " +
    mysql.escape(password);

    
  pool.getConnection(function(err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Could Not Get Connection Object");
    } else {
      con.query(sql, function(err, result) {
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain"
          });
          res.end("Invalid Credentials");
        } else {
          res.cookie("cookie", "admin", {
            maxAge: 900000,
            httpOnly: false,
            path: "/"
          });
          req.session.user = result;
          res.writeHead(200, {
            "Content-Type": "text/plain"
          });
          res.end("Successful Login");
          console.log("Successful login");
        }
      });
    }
  });
});

/*app.post("/login", function(req, res) {
  // Object.keys(req.body).forEach(function(key){
  //     req.body = JSON.parse(key);
  // });
  // var username = req.body.username;
  // var password = req.body.password;
  console.log("Inside Login Post Request");
  //console.log("Req Body : ", username + "password : ",password);
  console.log("Req Body : ", req.body);
  Users.filter(function(user) {
    if (
      user.username === req.body.username &&
      user.password === req.body.password
    ) {
      res.cookie("cookie", "admin", {
        maxAge: 900000,
        httpOnly: false,
        path: "/"
      });
      req.session.user = user;
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end("Successful Login");
    }
  });
});
*/

//Route to get All Students when user visits the Home Page
//app.get("/home", function(req, res) {
//console.log("Inside Home Login");
//res.writeHead(200, {
//"Content-Type": "application/json"
//});
//console.log("Student : ", JSON.stringify(students));
//res.end(JSON.stringify(students));
//});
app.get("/home", function(req, res) {
  console.log("Inside student get request");
  var sql = "SELECT * FROM student";
  console.log(sql);
  pool.getConnection(function(err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Could Not Get Connection Object");
    } else {
      con.query(sql, function(err, result) {
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain"
          });
          res.end("Could Not Get Connection Object");
        } else {
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          console.log(result);
          res.end(JSON.stringify(result));
        }
      });
    }
  });
});

/*app.post("/create", function(req, res) {
  console.log("Inside create request");
  console.log("Req body :", req.body);
  var newStudent = {
    Name: req.body.Name,
    StudentID: req.body.StudentID,
    Department: req.body.Department
  };
  students.push(newStudent);
  res.redirect("/home");
  console.log("New student added successfully");
});*/

app.post("/create", function(req, res) {
  console.log("Inside Create Request Handler");
  console.log(req.body);
  var sql =
    "INSERT INTO student VALUES ( " +
    mysql.escape(req.body.Name) +
    " , " +
    mysql.escape(req.body.StudentID) +
    " , " +
    mysql.escape(req.body.Department) +
    " ) ";
  console.log(sql);
  pool.getConnection(function(err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Could Not Get Connection Object");
    } else {
      con.query(sql, function(err, result) {
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain"
          });
          res.end("Error While adding Student");
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain"
          });

          res.end("Student added Successfully");
        }
      });
    }
  });
});

app.delete("/delete/:id", function(req, res) {
  console.log("Inside Delete Request");
  console.log("Student to Delete : ", req.params.StudentID);
  var sql =
    "DELETE FROM student WHERE studentid = " + mysql.escape(req.params.id);
  console.log(sql);
  pool.getConnection(function(err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Could Not Get Connection Object");
    } else {
      con.query(sql, function(err, result) {
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain"
          });
          res.end("Error Deleting Book");
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain"
          });
          res.end("Student Deleted Successfully");
        }
      });
    }
  });
});
/*app.delete("/delete/:StudentID", function(req, res) {
  console.log("Inside delete request");
  console.log("Req body: ", req.params.StudentID);
  students.splice(
    students.findIndex(id => id.StudentID === req.params.StudentID),
    1
  );
  console.log("Student deleted successfully");
  res.end(JSON.stringify(students));
});*/
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
