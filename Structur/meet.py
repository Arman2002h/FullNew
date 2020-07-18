{
	"meet": {
		"id": int,
		"admin": str,
		"settings": {
			"security": {
				"screen share": bool,
				"chat": bool,
			},
			"url": str,
			"password": str,
			"max_users": int,
			"admin_state": int;
		},
		"chat": {

			"message": [

				{"user": "message"},
				{"user1": "message1"},
				{"user2": "message2"}

			],

		}

		"useres": {

			"user": {
				"user_settings":{
					"name": str,
					"surname": str,
					"state": int,
					"img_url": str,
					"reaction": str,
				},
			},
			"user1": {
				"user_settings":{
					"name": str,
					"surname": str,
					"state": int,
					"img_url": str,
					"reaction": str,
				},
			},
			"user2": {
				"user_settings":{
					"name": str,
					"surname": str,
					"state": int,
					"img_url": str,
					"reaction": str,
				},
			},
		
		},
	
		"pending_users": {
			"user": str,
			"user1": str,
			"user2": str,
		}

		"call_length": str,
		"desktop": "I don`t know"
	}
}