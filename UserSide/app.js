if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
  }
  
const express = require('express')
//const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require("fs");
const initializePassport = require('./passport-config')
const { RSA_PKCS1_OAEP_PADDING } = require('constants');
const path = require('path');
var Busboy = require('busboy')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://sahak12:newdvbt2@cluster0.8lxiu.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";
var ObjectId = require('mongodb').ObjectId; 

var users = []

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var cursor = dbo.collection("users").find();
  cursor.each(function(err, item) {
    if(item == null) {
      db.close();
      return;
    }
    users.push(item)

  });
  function ax(){
    //console.log(users)
    initializePassport(
      passport,
      email => users.find(user => user.email === email),
      _id => users.find(user => user._id === _id)
    )
    console.log("Started")
  }
  setTimeout(ax, 2000)
  
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get("/", function(req, res){
	res.sendFile(__dirname+"/main.html")
});

app.get('/login', checkNotAuthenticated, (req, res) => {
	//res.render('login.html')
	res.sendFile(__dirname+"/login.html")
  })

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
successRedirect: '/dash',
failureRedirect: '/login',
failureFlash: true
}))

app.get("/dash", checkAuthenticated, (req, res) => {
	res.sendFile(__dirname+"/index.html")
});

app.post('/getUserInfo1', checkAuthenticated, (req, res) => { 
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		dbo.collection("users").findOne({"_id" : req.user}, function(err, result) {
		if (err) throw err;
		console.log(result);
		//res.end(JSON.stringify(result))
		db.close();
		});
	});
	res.end(JSON.stringify({name: req.user}))
   });

  app.post('/getUserInfo', checkAuthenticated, (req, res) => {
	//console.log(req.body.email)
	if(req.body.smth == "a1502"){
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			var o_id = new ObjectId(req.user);
			dbo.collection("users").findOne({_id : o_id}, function(err, result) {
			if (err) throw err;
			console.log(result);
			res.end(JSON.stringify(result))
			db.close();
			});
		});
	}
  });


app.post("/addNewPost",  (req, res) => {
	var adminId;
	var postCont = ["titlePost", "topicPost", "maxPost", "callPost", "addPost", "descPost"]
	var newPostId;
	var admin;
	console.log(req.body.titlePost,req.body.maxPost,req.body.descPost,req.body.callPost,req.body.addPost,req.body.topicPost,)
	MongoClient.connect(url, {poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		var cursor = dbo.collection('lessons').find();
		  var query = { email: req.body.admin };
		  dbo.collection("users").find(query).toArray(function(err, result) {
		    if (err) throw err;
		    console.log(result[0]._id);
		    adminId = result[0]._id
		    admin = result[0]
		    console.log(admin)
		    var lessonObj = {
				Idadmin: adminId,
				settings: {
					tittle: req.body.titlePost,
					maxStudents: req.body.maxPost,
					meetingId: "Still no",
					meetingUrl: "Still no",
					describtion: req.body.descPost,
					allCanCall: req.body.callPost,
					allCanAddPost: req.body.addPost,
					topic: req.body.topicPost,
				},
				joindedUsers: [],
				pendingUsers: [],
				onlineUsers: [],
				lessons: {
					read: {},
					task: {},
				},
			}
			dbo.collection("lessons").insertOne(lessonObj, function(err, ress) {
				if (err) throw err;
				console.log(ress.insertedId, "Lesson added");
				console.log(ress.insertedId)
				newPostId = ress.insertedId
				//setTimeout(deKill(ress.insertedIdn, adminId), 1000)
				//deKill(ress.insertedIdn, adminId)
				//db.close();
				var a = admin.createdLessons
				a.push(ress.insertedId)
				dbo.collection("users").updateOne({ _id: adminId }, { $set: {createdLessons:  a} }, function(err, res) {
					if (err) throw err;
					   console.log("1 document updated", newPostId);
					   db.close();
				});
			  });
//admin.createdLessons.push(newPostId)
console.log(newPostId)
		  var myquery = { _id: adminId };
		  var newvalues = { $set: {createdLessons:  ["1", "2", newPostId]} };


		    //db.close();
		    
		  });
	    
	    function deKill(a, b){
	    	console.log("function", a, b)
			//var dbo = db.db("mydb");
	    	dbo.collection("users").updateOne({ _id: b }, { $set: {createdLessons:  ["1", "2", a]} }, function(err, res) {
	    	if (err) throw err;
	   		console.log("1 document updated", newPostId);
	  	 	db.close();
	    });
	}



	});


});

app.post('/fileupload', function (req, res)  {
    var busboy = new Busboy({ headers: req.headers });

console.log("Fiuckkk")
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		var o_id = new ObjectId("5f1609dd294d04144456e69e");
		console.log("HoHeyyy")
		dbo.collection("users").findOne({_id : o_id}, function(err, result) {
		if (err) throw err;
		console.log("Heyy");
		busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

			var saveTo = path.join(__dirname, 'public/images/' + result.email + '/a.png');
			console.log(result.email, "asdasdasd")
			file.pipe(fs.createWriteStream(saveTo));
		  });
		db.close();
		});
	});
    busboy.on('finish', function() {
		res.writeHead(200, { 'Connection': 'close' });
		res.end("Good");
	  });
    return req.pipe(busboy);   
});

app.post("/registerUser",  (req, res) => {

	MongoClient.connect(url, async  function(err, db) {
	if (err) throw err;
	var dbo = db.db("mydb");
	var cursor = dbo.collection('users').find();
	users = []
	var wasAcc = 0
	cursor.each(function(err, item) {
		console.log(item)
		if(item == null) {
			//db.close();
			console.log("BIG ")
			return;
		}
		users.push(item)
		if(item.email == req.body.rg_email){
			console.log("DETECTED ACCOuNT")
			//res.sendFile(__dirname+"/login.html")
			wasAcc = 1
			return;
		}
	});
		if(wasAcc == 0){
			const hashedPassword = await bcrypt.hash(req.body.rg_pass, 12)
			var userObj = { 
				name: req.body.name, 
				sname: req.body.sname,
				email: req.body.rg_email,
				gend: req.body.rg_gend,
				birth: req.body.rg_birth,
				joinLessons: [],
				createdLessons: [],
				password: hashedPassword,
				notefication: {
					read: {
						unreq: {
							r_un: ["Hello"]
						},
						req: {
							r_r: []
						},
					},
					unread: {
						unreq: {
							un_un: []
						},
						req: {
							un_r: []
						},
					},
		
			} 
		};
		dbo.collection("users").insertOne(userObj, function(err, res) {
			if (err) throw err;
			console.log("User added");
			db.close();
		  });
		users.push(userObj)
		 function ax(){
			console.log(users)
			initializePassport(
			  passport,
			  email => users.find(user => user.email === email),
			  _id => users.find(user => user._id === _id)
			)
			console.log("Started")
		  }
		  setTimeout(ax, 1500)
		 // res.sendFile(__dirname+"/index.html")
		}
		
	
	
	});
	res.redirect('/login')
});

app.delete('/logout', (req, res) => {
	req.logOut()
	res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
	  return next()
	}
  
	res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
	  return res.redirect('/dash')
	}
	next()
  }

app.listen(3000, () => {
    console.log("I am running");
});