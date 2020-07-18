var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://sahak12:newdvbt2@cluster0.8lxiu.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { 

		name: "Karen", 
		sname: "Sahakyan",
		email: "sahak.sahakyan2017@gmail.com",
		gend: "m",
		birth: "14-12-2003",
		joinLessons: ["1", "2"],
		createdLessons: ["3", "4"],
		password: "newdvbt2",
		notefication: {
			read: {
				unreq: {
					r_un: ["1", "2"]
				},
				req: {
					r_r: ["3", "4"]
				},
			},
			unread: {
				unreq: {
					un_un: ["5", "6"]
				},
				req: {
					un_r: ["7", "8"]
				},
			},

	} 
};


  dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
