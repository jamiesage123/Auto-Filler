class Generator {
    /**
     * Generate dummy data
     * @param rule
     * @return string
     */
    static generate(rule) {
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
                return chance.email({domain: "gmail.com"}); // TODO: Include domain in settings
            case "telephone":
                return chance.phone({country: 'uk', mobile: true}); // TODO: Include country option in settings
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
                return ("0" + chance.hour({twentyfour: true})).slice(-2) + ':' + ("0" + chance.minute()).slice(-2); // TODO: Include twentyfour flag in settings
            case "date":
                return chance.date();
            case "month":
                return chance.date();
            case "week":
                return chance.date();
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
                return chance.sentence(); // TODO: Include words in settings
            case "paragraph":
                return chance.paragraph(); // TODO: Include sentences option in settings
            case "word":
                return chance.word();
            case "color":
                return this.randomHex();
            case "custom":
                return rule.text;
            case "regex":
            default: {
                return chance.sentence({ words: 7 });
            }
        }
    }

    /**
     * Generate a random hexadecimal number
     * @author https://www.paulirish.com/2009/random-hex-color-code-snippets/
     * @returns {string}
     */
    static randomHex() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
}