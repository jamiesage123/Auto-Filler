// TODO: Better default settings
var defaultSettings = {
	fill_all_form: 0,
	ignore_checkboxes: 0,
    date_range: '20(16|17)',
    time: '([01]\\d|2[0-3]):([0-5]\\d)',
	rules: [
		{
			name: "First name",
			type: "first_name",
			fields: "firstname, first_name, first"
		},
		{
			name: "Email address",
			type: "email",
			fields: "email, email_address, emailaddress"
		},
		{
			name: "Password",
			type: "custom",
			fields: "password, confirm_password, pass, confirm_pass",
			text: "Password1"
		},
        {
            name: "Date",
            type: "date",
            fields: "date, dob",
        },
        {
            name: "Range",
            type: "range",
            fields: "range"
        }
	]
};

// TODO: Add more additional fields (see chancejs docs)
var settingTemplates = {
	"Person": {
        "username": {
            public_name: "Username",
            fields: "username, userid"
        },
        "full_name": {
            public_name: "Full name",
            fields: "name, fullname, full_name"
        },
        "first_name": {
            public_name: "First name",
            fields: "firstname, first_name, first"
        },
        "last_name": {
            public_name: "Last name",
            fields: "lastname, last_name, surname, secondname, last"
        },
        "gender": {
            public_name: "Gender",
            fields: "gender"
        },
        "email": {
            public_name: "Email",
            fields: "email, email_address, emailaddress"
        },
        "telephone": {
            public_name: "Telephone",
            fields: "phone, telephone"
        }
    },
	"Address": {
        "street": {
            public_name: "Street",
            fields: "street, address, address1, address_lineone"
        },
        "postal_code": {
            public_name: "Postal code",
            fields: "postcode, postalcode, post_code, postal_code"
        },
        "zip_code": {
            public_name: "Zip code",
            fields: "zip"
        },
        "city": {
            public_name: "City",
            fields: "city"
        },
        "country": {
            public_name: "Country",
            fields: "country"
        },
        "province": {
            public_name: "Province",
            fields: "province, county"
        },
        "state": {
            public_name: "State",
            fields: "state"
        }
    },
	"Dates and times": {
        "time": {
            public_name: "Time",
            fields: "time"
        },
        "date": {
            public_name: "Date",
            fields: "date, dob"
        },
        "datetime": {
            public_name: "Date and time",
            fields: "datetime, date-time, datetimelocal, datetime-local"
        },
        "month": {
            public_name: "Month selector",
            fields: "month"
        },
        "week": {
            public_name: "Week selector",
            fields: "week"
        }
    },
	"Websites": {
        "website": {
            public_name: "Website",
            fields: "url, website,"
        },
        "twitter_hashtag": {
            public_name: "Twitter hashtag",
            fields: "hashtag"
        },
        "twitter_handle": {
            public_name: "Twitter handle",
            fields: "twitter_handle"
        }
    },
    "Words, numbers and misc": {
        "number": {
            public_name: "Number",
            fields: "integer, int, number, numeric, price, qty, quantity",
            min: 1,
            max: 200
        },
        "sentence": {
            public_name: "Sentence",
            fields: "sentence"
        },
        "paragraph": {
            public_name: "Paragraph",
            fields: "paragraph"
        },
        "word": {
            public_name: "Word",
            fields: "word"
        },
        "color": {
            public_name: "Colour",
            fields: "colour, color"
        },
        "range": {
            public_name: "Range",
            fields: "range"
        }
    },
	"Custom": {
        "custom": {
            public_name: "Custom text",
            fields: "my_field_name",
            text: "Custom text to output"
        },
		"regex": {
            public_name: "Regex",
            fields: "my_field_name",
            regex: ""
        }
    }
};