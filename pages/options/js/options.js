$(document).ready(function () {

    // Get all of the clients settings
    get();

    // Save all of the clients settings
    $(".save").click(function () {
        // Setting validation
        if ($("#settings-form").valid()) {
            save();
        }
    });

    // Triggered when the clients settings have been loaded
    $("body").on("settings_loaded", function (event, settings) {
        // Clear the rules div
        $("#rules").html('');

        // Add any custom rules
        $.each(settings.rules, function (key, rule) {
            var template = $("#rule-template").clone();
            template.prop('id', '');
            template.find('.rule-name').text(rule.name);

            $.each(rule, function (k, v) {
                if (k !== "name" && k !== "order" && !k.includes('_help')) {
                    var title = k.capitalizeFirstLetter().split('_')[0];
                    template.find('.rule-attributes').append('<p><strong>' + title.capitalizeFirstLetter() + '</strong>: ' + v + '</p>');
                }

                // Append this attribute into a hidden field (used for saving later down the line)
                template.append('<input type="hidden" id="' + k + '" value="' + v + '">');
            });

            template.show();

            $("#rules").append(template);
        });

        // Clear any type select boxes
        $(".types").html('');

        // Add the field types to the dropdowns
        $.each(settingTemplates, function (categoryName, items) {
            // Add the optgroup
            var html = '<optgroup label="' + categoryName + '">';

            // Add each item in this category
            $.each(items, function (key, item) {
                html = html + '<option value="' + key + '">' + item.public_name + '</option>';
            });

            // Close the optgroup
            html = html + '</optgroup>';

            // Append the category and it items to the select
            $(".types").append(html);
        });
    });

    // Show any additional fields after selecting a rule type
    $(".types").change(function () {
        createAdditionalFields($(this));
    });

    // Show the additional fields while the "Add rule" modal opens
    $('#addRuleModal').on('show.bs.modal', function (e) {
        createAdditionalFields($('#addRuleModal').find('.types'));
    });

    // Submit the create rule modal
    $("#create-rule").click(function () {
        if ($("#addRuleForm").valid()) {
            var template = $("#rule-template").clone();

            // Inputs
            $("#addRuleForm").find('input').each(function () {
                // Append this attribute into a hidden field (used for saving later down the line)
                if ($(this).prop('type').toLowerCase() !== 'checkbox') {
                    template.append('<input type="hidden" id="' + $(this).prop('id') + '" value="' + $(this).val() + '">');
                } else {
                    template.append('<input type="hidden" id="' + $(this).prop('id') + '" value="' + $(this).is(':checked') + '">');
                }
            });

            // Selects
            $("#addRuleForm").find('select').each(function () {
                // Append this attribute into a hidden field (used for saving later down the line)
                template.append('<input type="hidden" id="' + $(this).prop('id') + '" value="' + $(this).find(":selected").val() + '">');
            });

            $("#rules").append(template);

            // Save and reload
            reload();

            // Scroll to the new rule
            $("html, body").animate({scrollTop: $(document).height()}, "slow");

            // Clear the elements in the add rule modal
            var form = $("#addRuleForm");
            form.find('input[id=name]').val('');
            form.find('#type').val('username').trigger('change');

            // Hide the add rule modal
            $("#addRuleModal").modal('hide');
        }
    });

    // Delete a rule
    $('body').on('click', '.delete-rule', function () {
        if (confirm("Are you sure you want to delete this rule?")) {
            // Remove the rule
            $(this).closest('div[data-rule]').remove();

            // Save and reload
            reload();
        }
    });

    // Custom validation rules
    // These rules aren't built to prevent 100% of bad input but to stop anything obviously incorrect being inputted
    // The user should know what they are doing when changing these settings
    $.validator.addMethod('validRegEx', function (value) {
        try {
            new RandExp(value).gen();
        } catch (err) {
            console.log(err.message);
            return false;
        }
        return true;
    }, 'Please enter a valid regular expression');

    // Rule to determine if the value is 4 digits
    $.validator.addMethod('year', function (value) {
        var output = new RandExp(value).gen();
        return /^\d{4}$/.test(output);
    }, 'The value of this expression must return a 4 digit number');

    // Rule to determine a valid time (HH:MM)
    $.validator.addMethod('time', function (value) {
        var output = new RandExp(value).gen();
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(output);
    }, 'This value of this expression must return a valid time (HH:MM)');

    // Validation
    $("#settings-form").validate({
        rules: {
            date_range: {
                validRegEx: true,
                year: true
            },
            time: {
                validRegEx: true,
                time: true
            }
        },
        onfocusout: function (element) {
            jQuery(element).valid()
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.insertBefore(element);
        }
    });
});

/**
 * Save the clients settings
 */
function save(settings) {
    // Create the rules object
    var rules = [];

    // Get all the rules and add them to our rules object
    $('#rules').find('.mui-panel').each(function () {
        var rule = {};

        $(this).find('input[type=hidden]').each(function () {
            rule[$(this).prop('id')] = $(this).val();
        });

        rules.push(rule);
    });

    if (typeof settings === 'undefined') {
        settings = {
            fill_all_form: $("#fill_all_form").is(':checked'),
            ignore_checkboxes: $("#ignore_checkboxes").is(':checked'),
            ignore_disabled_fields: $("#ignore_disabled_fields").is(':checked'),
            ignore_hidden_fields: $("#ignore_hidden_fields").is(':checked'),
            date_types: $('#date_types').find(":selected").val(),
            date_range: $("#date_range").val(),
            time: $("#time").val(),
            rules: rules,
            date_now: $("#date_now").is(':checked'),
            time_now: $("#time_now").is(':checked')
        };
    }

    chrome.storage.sync.set(settings, function () {
        // Update status to let user know options were saved.
        $(".save-wrapper p span").fadeIn();
        setTimeout(function () {
            $(".save-wrapper p span").fadeOut('slow');
        }, 850);
    });
}

/**
 * Get the clients settings
 */
function get() {
    chrome.storage.sync.get(defaultSettings, function (items) {
        $("#fill_all_form").prop('checked', items.fill_all_form);
        $("#ignore_checkboxes").prop('checked', items.ignore_checkboxes);
        $("#ignore_disabled_fields").prop('checked', items.ignore_disabled_fields);
        $("#ignore_hidden_fields").prop('checked', items.ignore_hidden_fields);
        $("#date_types").val(items.date_types);
        $("#date_range").val(items.date_range);
        $("#time").val(items.time);
        $("#date_now").prop('checked', items.date_now);
        $("#time_now").prop('checked', items.time_now);
        $("body").trigger("settings_loaded", [items]);
    });
}

/**
 * Reload the clients settings
 */
function reload(settings) {
    save(settings);
    get();
}

/**
 * Create the additional fields in the "New rule" modal
 * @param select
 */
function createAdditionalFields(select) {
    // Find the template for this type
    var type = select.find(":selected").val();
    var template = null;
    $.each(settingTemplates, function (categoryName, items) {
        $.each(items, function (key, item) {
            if (key == type) {
                template = item;
                return false;
            }
        });

        // We don't need to continue searching if we found the template
        if (template != null) {
            return false;
        }
    });

    // If we found a template
    if (template) {
        // Clear any previous additional fields
        $("#additional_fields").html('');

        // Add the additional fields
        $.each(template, function (key, value) {
            if (key !== 'public_name' && !key.includes('_help') && !key.includes('_dropdown') && !key.includes('_checkbox')) {
                // Determine the type of this field
                var type = jQuery.isNumeric(value) ? 'number' : 'text';

                // Create the input
                var html = '';
                html = html + '<div class="form-group">'
                html = html + '<label for="' + key + '">' + key.capitalizeFirstLetter() + '</label>';
                html = html + '<input class="form-control" type="' + type + '" id="' + key + '" name="' + key + '" value="' + value + '" required>';
                html = html + '</div>';

                // Append the input
                $("#additional_fields").append(html);
            }

            // Helper text
            if (key.includes('_help')) {
                $("#additional_fields").append('<p class="help-block" style="margin-top: -13px;">' + value + '</p>');
            }

            // Dropdown (select)
            if (key.includes('_dropdown')) {
                var html = '';
                html = html + '<div class="form-group">'
                html = html + '<label for="' + key + '">' + key.capitalizeFirstLetter().replace('_dropdown', '') + '</label>';

                html = html + '<select id="' + key + '" name="' + key + '" class="form-control">';
                $.each(value, function(k) {
                    html = html + '<option value="' + k + '">' + value[k] + '</option>';
                });
                html = html + '</select>';
                html = html + '</div>';

                // Append the input
                $("#additional_fields").append(html);
            }

            // Checkbox
            if (key.includes('_checkbox')) {
                var html = '';
                html = html + '<div class="form-group">'
                html = html + '<div class="checkbox">';
                html = html + '<label><input id="' + key + '" name="' + key + '" type="checkbox" value="1" ' + (value ? 'checked' : '') + '>' + key.capitalizeFirstLetter().replace('_checkbox', '') + '</label>';
                html = html + '</div>';
                html = html + '</div>';
                // Append the input
                $("#additional_fields").append(html);
            }
        });

        // Add the validation
        $("#addRuleForm").validate();
    } else {
        // Fatal error, alert the user
        swal('Error', 'No rule template found for ' + type + '!', 'error');
    }
}