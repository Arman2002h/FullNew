const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require("fs");

app.use(cors());
app.use(bodyParser.json());


app.get("/", function(req, res){
	res.sendFile(__dirname+"/login.html")
});

app.post("/login", async (req, res) => {

	console.log(req.body)

});

app.listen(3000, () => {
    console.log("I am running");
});