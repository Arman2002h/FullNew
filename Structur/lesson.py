{
	"lesson1": {
		"id": str,
		"adminId": str,
		"settings": {
			"title"
			"maxStudents": int,
			"meetingId": str,
			"meetingUrl": str,
			"describtion": str,
			"allCanCall": bool,
			"allCanAddLesson": bool,
		}
		"joinedUsers": ["userId", "userId1", "userId2"]
		"pendingUsers": ["userId", "userId1", "userId2"]
		"onlineUsers": ["userId", "userId1", "userId2"]
		"lessons": {
			"read"{
				"title": str,
				"type": "read",
				"describtion": str,
				"filesPath": str,
				"likes": ["userId", "userId1"]
				"commets": {
					{"userId": "commet"},
					{"userId1": "commet1"},
					{"userId2": "commet2"}
				}
			}
			"task": {

			}
		}

	}

	"lesson1": {
		"id": str,
		"admin": str,
		"adminId": str,
		"settings": {
			"title"
			"maxStudents": int,
			"meetingId": str,
			"meetingUrl": str,
			"describtion": str,
			"allCanCall": bool,
			"allCanAddLesson": bool,
		}
		"joinedUsers": ["userId", "userId1", "userId2"]
		"pendingUsers": ["userId", "userId1", "userId2"]
		"onlineUsers": ["userId", "userId1", "userId2"]
		"lessons": {
			"read"{
				"title": str,
				"type": "read",
				"describtion": str,
				"filesPath": str,
				"likes": ["userId", "userId1"]
				"commets": {
					{"userId": "commet"},
					{"userId1": "commet1"},
					{"userId2": "commet2"}
				}
			}
			"task": {}
		}

	}
}



{"A": "b", "X": "y"}

res.body.A = "b" True