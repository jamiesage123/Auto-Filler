class Generator {
    constructor(settings) {
        // Store the settings
        this.settings = settings;

        // The last email address generated
        this.last_email = null;
    }

    /**
     * Generate dummy data
     * @param rule
     * @return String|Date|Integer
     */
    generate(rule) {
        if (typeof rule === "undefined" || typeof rule !== "undefined" && typeof rule.type === "undefined") {
            rule = {
                type: "unknown"
            };
        }

        switch (rule.type) {
            case "username":
                return chance.first().toLowerCase() + chance.last().toLowerCase() + chance.integer({
                        min: 111,
                        max: 999
                    });
            case "full_name":
                return chance.first() + ' ' + chance.last();
            case "first_name":
                return chance.last();
            case "last_name":
                return chance.last();
            case "gender":
                return chance.gender();
            case "email":
                this.last_email = this.email(rule.domains);
                return this.last_email;
            case "email_confirm":
                if (this.last_email === null) {
                    this.last_email = this.email();
                    return this.last_email;
                }
                var email = this.last_email;
                this.last_email = null;
                return email;
            case "telephone":
                return chance.phone({country: rule.country_dropdown, mobile: rule.mobile_checkbox === "true", formatted: rule.formatted_checkbox === "true"});
            case "street":
                return chance.street();
            case "postal_code":
                return chance.postal();
            case "zip_code":
                return chance.zip();
            case "city":
                return chance.city();
            case "country":
                return chance.country({full: true});
            case "province":
                return chance.province({full: true});
            case "state":
                return chance.state({full: true});
            case "time":
                return this.time();
            case "date":
                return this.date();
            case "month":
                return this.date();
            case "week":
                return this.date();
            case "website":
                return chance.domain();
            case "twitter_hashtag":
                return chance.hashtag();
            case "twitter_handle":
                return chance.twitter();
            case "range":
            case "number":
                return chance.integer({
                    min: (rule.min ? rule.min : 0),
                    max: (rule.max ? rule.max : 100)
                });
            case "sentence":
                return chance.sentence({ words: rule.words });
            case "paragraph":
                return chance.paragraph({ sentences: rule.sentences });
            case "word":
                return chance.word({ words: 1 });
            case "color":
                return this.randomHex();
            case "custom":
                return rule.text;
            case "regex":
                return new RandExp(rule.regex).gen();
            default: {
                return chance.sentence({ words: 7 });
            }
        }
    }

    /**
     * Generate a date based off the clients setting
     * @return Date
     */
    date() {
        var now = moment();

        // Generate a random date or todays date based off the clients settings
        var date = (this.settings.date_now ? new Date() : new Date(chance.date()));

        if (!this.settings.date_now) {
            // Take the clients date year range setting into consideration
            date.setFullYear(new RandExp(this.settings.date_range).gen());
        }

        // Convert the date to a moment instance
        date = moment(date);

        // The date type setting takes priority over the date year range setting
        // Verify the date is within the clients settings
        switch (this.settings.date_types) {
            case 'future_dates': {
                if (date < now) {
                    // While loop until the date is no longer in the past
                    while (date < now) {
                        date.add(chance.integer({min: 10, max: 60}), 'days');
                    }
                }
                break;
            }
            case 'past_dates': {
                if (date > now) {
                    // While loop until the date is no longer in the future
                    while (date > now) {
                        date.subtract(chance.integer({min: 10, max: 60}), 'days');
                    }
                }
                break;
            }
        }
        return date;
    }

    /**
     * Generate a time based off the clients setting
     * @return String
     */
    time() {
        return (this.settings.time_now ? moment().format('HH:mm') : new RandExp(this.settings.time).gen());
    }

    /**
     * Generate an email based off the clients settings
     */
    email(domains) {
        var domain = (typeof domains === "undefined" || typeof domains !== "undefined" && domains.length === 0 ? "gmail.com" : new RandExp(domains).gen());
        return chance.email({domain: domain});
    }

    /**
     * Generate a random hexadecimal number
     * @author https://www.paulirish.com/2009/random-hex-color-code-snippets/
     * @returns {string}
     */
    randomHex() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
}