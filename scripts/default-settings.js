// TODO: Better default settings
var defaultSettings = {
    "auto_filler_version": 1,
    "date_range": "20(16|17)",
    "date_types": "mixed",
    "fill_all_form": false,
    "ignore_checkboxes": false,
    "time": "([01]\\d|2[0-3]):([0-5]\\d)",
    "date_now": 0,
    "time_now": 0,
    "rules": [
        {
            "fields": "username, login, userid",
            "name": "Username",
            "type": "username"
        }, {
            "fields": "password, pass",
            "name": "Password",
            "type": "custom",
            "text": "Password1"
        }, {
            "fields": "fullname, full_name",
            "name": "Full name",
            "type": "full_name"
        }, {
            "fields": "firstname, first_name, forename",
            "name": "First name",
            "type": "first_name"
        }, {
            "fields": "lastname, last_name, surname, secondname",
            "name": "Last name",
            "type": "last_name"
        },  {
            "name": "Email confirmation",
            "fields": "emailconfirm, email_address_confirm, emailaddress_confirm",
            "type": "email_confirm"
        }, {
            "fields": "email, email_address, emailaddress",
            "name": "Email address",
            "type": "email",
            "domains": "(gmail\\.com|hotmail\\.com)"
        }, {
            "fields": "phone, telephone, contact_number, mobile",
            "name": "Telephone/Mobile",
            "type": "telephone"
        }, {
            "fields": "street, address, address1, address_lineone",
            "name": "Street",
            "type": "street"
        }, {
            "fields": "city",
            "name": "City",
            "type": "city"
        }, {
            "fields": "province, county",
            "name": "Province",
            "type": "province"
        }, {
            "fields": "postcode, postalcode, post_code, postal_code",
            "name": "Postcode",
            "type": "postal_code"
        }, {
            "fields": "country",
            "name": "Country",
            "type": "country"
        }, {
            "fields": "time",
            "name": "Time",
            "type": "time"
        }, {
            "fields": "date, dob",
            "name": "Date",
            "type": "date"
        }, {
            "type": "website",
            "name": "Website",
            "fields": "url, website"
        }, {
            "type": "twitter_hashtag",
            "name": "Twitter hashtag",
            "fields": "hashtag"
        }
    ]
};

// TODO: Add more additional fields (see chancejs docs)
var settingTemplates = {
    "Person": {
        "username": {
            public_name: "Username",
            fields: "username, login, userid"
        },
        "full_name": {
            public_name: "Full name",
            fields: "fullname, full_name"
        },
        "first_name": {
            public_name: "First name",
            fields: "firstname, first_name, forename,"
        },
        "last_name": {
            public_name: "Last name",
            fields: "lastname, last_name, surname, secondname"
        },
        "gender": {
            public_name: "Gender",
            fields: "gender"
        },
        "email": {
            public_name: "Email",
            fields: "email, email_address, emailaddress",
            domains: "(gmail\\.com|hotmail\\.com)",
            regex_help: "Periods (.) must be escaped with a backwards slash (\\). See <a href=\"https://fent.github.io/randexp.js/\" target=\"_BLANK\">randexp.js</a> for more information."
        },
        "email_confirm": {
            public_name: "Email confirmation",
            fields: "emailconfirm, email_address_confirm, emailaddress_confirm"
        },
        "telephone": {
            public_name: "Telephone",
            fields: "phone, telephone, contact_number, mobile"
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
            fields: "twitter_handle, twitter"
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
            regex: "",
            regex_help: "See <a href=\"https://fent.github.io/randexp.js/\" target=\"_BLANK\">randexp.js</a> for more information"
        }
    }
};