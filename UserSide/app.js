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