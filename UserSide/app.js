const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require("fs");
const { RSA_PKCS1_OAEP_PADDING } = require('constants');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://sahak12:newdvbt2@cluster0.8lxiu.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";


app.use(cors());
app.use(bodyParser.json());


app.get("/", function(req, res){
	res.sendFile(__dirname+"/login.html")
});

app.get("/dash", function(req, res){
	res.sendFile(__dirname+"/index.html")
});

app.post('/getUserInfo',function(req, res){
	//console.log(req.body.email)
	if(req.body.smth == "a1502"){
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("users").findOne({email: req.body.email}, function(err, result) {
			if (err) throw err;
			console.log(result.name);
			res.end(JSON.stringify(result))
			db.close();
			});
		});
	}
  });

app.post("/login", async (req, res) => {
	console.log(req.body)
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		var cursor = dbo.collection('users').find();
	
		cursor.each(function(err, item) {
			if(item == null) {
				db.close();
				return;
			}
			if(item.email == req.body.email && item.password == req.body.password){
				res.sendFile(__dirname+"/index.html")
			}
		});
	});
		res.sendFile(__dirname+"/login.html")
});

app.post("/addNewPost",  (req, res) => {
	var adminId;
	var postCont = ["titlePost", "topicPost", "maxPost", "callPost", "addPost", "descPost"]
	var newPostId;
	var admin;
	console.log(req.body.titlePost,req.body.maxPost,req.body.descPost,req.body.callPost,req.body.addPost,req.body.topicPost,)
	MongoClient.connect(url, {poolSize: 10}, function(err, db) {
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
				deKill(ress.insertedIdn, adminId)
				db.close();
			  });
//admin.createdLessons.push(newPostId)
console.log(newPostId)
		  var myquery = { _id: adminId };
		  var newvalues = { $set: {createdLessons:  ["1", "2", newPostId]} };


		    db.close();
		    
		  });
	    
	    function deKill(a, b){
	    	console.log("function", a)
var dbo1 = db.db("mydb");
	    		dbo1.collection("users").updateOne({ _id: b }, { $set: {createdLessons:  ["1", "2", a]} }, function(err, res) {
	    	if (err) throw err;
	   		console.log("1 document updated", newPostId);
	  	 	db.close();
	    });
	}



	});


});

app.post("/registerUser", async (req, res) => {

	MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbo = db.db("mydb");
	var cursor = dbo.collection('users').find();

	cursor.each(function(err, item) {
		if(item == null) {
			db.close();
			return;
		}
		if(item.email == req.body.rg_email){
			console.log("DETECTED ACCOuNT")
			//res.sendFile(__dirname+"/login.html")
			return;
		}
		else{
			var userObj = { 
				name: req.body.name, 
				sname: req.body.sname,
				email: req.body.rg_email,
				gend: req.body.rg_gend,
				birth: req.body.rg_birth,
				joinLessons: [],
				createdLessons: [],
				password: req.body.rg_pass,
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
		 // res.sendFile(__dirname+"/index.html")
		}
		
	});
	
	});
	res.sendFile(__dirname+"/index.html")
});

app.listen(3000, () => {
    console.log("I am running");
});