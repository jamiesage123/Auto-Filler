class AutoFiller {
    constructor(settings) {
        // Store the settings
        this.settings = settings;

        // Load the generator
        this.generator = new Generator(this.settings);

        // Define the tags and input types we support
        this.tags = ['input', 'textarea', 'select'];
        this.inputTypes = ['checkbox', 'color', 'date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'];
    }

    /**
     * Fill in a form using the clients settings
     */
    fill() {
        var element = $(':focus');
        var scope = this;

        if (element.length !== 0 && this.isValidInput(element)) {
            // Determine at what point in the DOM we start searching for fields
            // Attempt to find the elements form
            var form = element.closest('form');

            // If no form in available, start from the body
            if (form.length === 0) {
                form = $('body');
            }

            // Build a string of our tags
            var toFind = this.tagsToString();

            // Get a list of elements we need to fill
            var list = form.find(toFind);

            // If the client only wants to fill in elements after the current one
            var elements = [];
            if (!this.settings.fill_all_form) {
                var include = false;
                list.each(function (key, item) {
                    if (!include && item === element[0]) {
                        include = true;
                    }

                    if (include) {
                        elements.push(item);
                    }
                });
            } else {
                elements = list;
            }

            // Now we have a list of elements which need filling, loop through them all
            $.each(elements, function (key, item) {
                if (scope.isValidInput(item)) {
                    scope.fillInput(item);
                }
            });
        }
    }

    /**
     * Fill an element based on the clients rules
     * @param element
     * @param rule
     */
    fillInput(element, rule) {
        if (typeof element !== "undefined") {
            element = $(element);

            // Find the rules for this element
            rule = (typeof rule !== "undefined" ? rule : this.getElementRules(element));

            // Set the elements value
            this.setValue(element, this.generator.generate(rule), rule);
        }
    }

    /**
     * Get an element rules from the clients settings
     * @param element
     * @param ruleList
     * @return object
     */
    getElementRules(element, ruleList) {
        if (typeof element !== "undefined") {
            element = $(element);

            var rule = undefined;

            // Get the elements id
            var id = element.prop('id').toLowerCase();

            // Get the element name
            var name = element.prop('name').toLowerCase();

            ruleList = (typeof ruleList === 'undefined' ? this.settings.rules : ruleList);

            // Match the element with a rule set
            $.each(ruleList, function (key, item) {
                var fields = item.fields.split(', ');

                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i].toLowerCase();
                    var findBy = (name.length > 0 ? name : id);
                    var label = null;

                    if (findBy.length !== 0) {
                        try {
                            label = element.parent().find('label[for=' + (name.length > 0 ? name : id) + ']');
                        } catch(e) {
                            // The label selector was invalid, exclude the label search
                            label = null;
                        }
                    }

                    if ((id.length > 0 && id.includes(field)) || (name.length > 0 && name.includes(field)) || (label !== null && label.length !== 0 && label.text().includes(field))) {
                        rule = item;
                        return false;
                    }
                }
            });
        }
        return rule;
    }

    /**
     * Set the value of an element
     * @param element
     * @param value
     * @param rule
     * @return boolean
     */
    setValue(element, value, rule) {
        if (typeof element !== "undefined") {
            element = $(element);

            // Get the elements type
            var type = element.prop('type').toLowerCase();

            // Rule fallback
            // If the client doesn't have a rule stored for the following types, fall back to the template rules..
            // ..as these elements request specific values to be filled correctly
            if (typeof rule === "undefined") {
                // These elements need specific values, re-run fillInput with the default template rule
                switch (type) {
                    case 'number':
                    case 'color':
                    case 'time':
                    case 'date':
                    case 'datetime':
                    case 'datetime-local':
                    case 'month':
                    case 'range':
                    case 'week': {
                        // Generate a custom list of rules based off the settings template
                        var rules = [];
                        $.each(settingTemplates, function (key, items) {
                            $.each(items, function (k, rule) {
                                rule.type = k;
                                rules.push(rule);
                            });
                        });

                        // Get the rule for this element
                        var rule = this.getElementRules(element, rules);

                        // Fill the input using the new rule
                        this.fillInput(element, rule);
                        return true;
                    }
                }
            }

            // Some element types require different functions and data manipulation in order to be filled correctly
            switch (type) {
                case 'radio': {
                    // Select a radio button
                    var elements = $('input[name=' + element.prop('name') + ']');
                    element = elements[chance.integer({min: 0, max: (elements.length - 1)})];
                    element.click();
                    break;
                }
                case 'checkbox': {
                    // Select a checkbox
                    element.prop('checked', chance.integer({min: 0, max: 1})).click();
                    break;
                }
                case 'range':
                case 'number': {
                    // Check for a valid number
                    if (jQuery.isNumeric(value)) {
                        element.val(value);
                    }
                    break;
                }
                case 'date': {
                    if (!moment(value).isValid()) {
                        return false;
                    }

                    // Only allow the "yyyy-MM-dd" format
                    element.val(moment(value).format('YYYY-MM-DD'));
                    break;
                }
                case 'datetime':
                case 'datetime-local': {
                    if (!moment(value).isValid()) {
                        return false;
                    }

                    // Only allow the "yyyy-MM-ddThh:mm" format
                    element.val(moment(value).format('YYYY-MM-DD') + 'T' + moment(value).format('HH:mm'));
                    break;
                }
                case 'month': {
                    if (!moment(value).isValid()) {
                        return false;
                    }

                    // Only allow the "yyyy-MM" format
                    element.val(moment(value).format('YYYY-MM'));
                    break;
                }
                case 'week': {
                    if (!moment(value).isValid()) {
                        return false;
                    }

                    // Only allow the "yyyy-Www" format
                    var date = moment(value);
                    element.val(date.weekYear() + "-W" + ("0" + date.week()).slice(-2));
                    break;
                }
                case 'select-one':
                case 'select-multiple': {
                    // Deselect any selected options
                    element.find("option:selected").prop("selected", false);

                    // Select a random option
                    var random = chance.integer({min: 0, max: (element.find('option').length - 1)});
                    element.find('option').eq(random).prop('selected', true);
                    break;
                }
                case 'color': {
                    // Only allow valid hex colours
                    if (!/^#[0-9A-F]{6}$/i.test(value)) {
                        return false;
                    }
                }
                default: {
                    // Handle date fields which don't have the 'date' type
                    if (typeof rule !== "undefined" && rule.type === 'date') {
                        element.val(moment(value).format(this.settings.date_format));
                    } else {
                        element.val(value);
                    }
                }
            }

            // Trigger the relevant events
            if (type !== 'radio' && type !== 'checkbox') {
                element[0].dispatchEvent(new Event('change'));
                element[0].dispatchEvent(new Event('input'));
                element[0].dispatchEvent(new Event('blur'));
            }
            return true;
        }
        return false;
    }

    /**
     * Check if an element is a valid input which can be filled
     * @param element
     * @return boolean
     */
    isValidInput(element) {
        if (typeof element !== "undefined") {
            element = $(element);

            // Get the tag of this element
            var tag = element.prop('tagName').toLowerCase();

            // Get the input type of this element
            var type = element.prop('type').toLowerCase();

            if (this.settings.ignore_disabled_fields) {
                // Check if the element is disabled
                if (element.is(':disabled')) {
                    return false;
                }

                // Check if the element is read only
                if (element.attr("readonly")) {
                    return false;
                }

                // Check if the field is apart of a fieldset which is readonly or disabled
                var fieldset = element.parent('fieldset');
                if (fieldset.length != 0) {
                    if (fieldset.attr("readonly") || fieldset.is(':disabled')) {
                        return false;
                    }
                }
            }

            if (this.settings.ignore_hidden_fields) {
                // Only allow elements which are visible
                if (element.is(":hidden")) {
                    return false;
                }
            }

            // Checkboxes and radio buttons
            if (this.settings.ignore_checkboxes) {
                if (type === 'checkbox' || type === 'radio') {
                    return false;
                }
            }

            // Check if we support this element
            if (this.tags.indexOf(tag) !== -1) {
                // We don't need to do any further checks for textareas or selects
                if (tag === 'textarea' || tag === 'select') {
                    return true;
                }

                // Validate that we support this elements type
                if (this.inputTypes.indexOf(type) !== -1) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Convert the tags array to a string
     * @return string
     */
    tagsToString() {
        var string = '';
        for (var i in this.tags) {
            string = this.tags[i] + ', ' + string;
        }
        string = string.replace(/,(\s+)?$/, '');
        return string;
    }
}