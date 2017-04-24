jQuery(function ($) {
    /**
     * Side Drawer
     */
    var $bodyEl = $('body'), $sidedrawerEl = $('#sidedrawer');

    String.prototype.capitalizeFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function showSidedrawer() {
        // show overlay
        var options = {
            onclose: function () {
                $sidedrawerEl.removeClass('active').appendTo(document.body);
            }
        };

        var $overlayEl = $(mui.overlay('on', options));

        // show element
        $sidedrawerEl.appendTo($overlayEl);
        setTimeout(function () {
            $sidedrawerEl.addClass('active');
        }, 20);
    }

    function hideSidedrawer() {
        $bodyEl.toggleClass('hide-sidedrawer');
    }


    $('.js-show-sidedrawer').on('click', showSidedrawer);
    $('.js-hide-sidedrawer').on('click', hideSidedrawer);

    var running = false;
    $('#sidedrawer').find('ul li').click(function () {
        if (!running) {
            running = true;

            var panel = $(this).data('open-panel');
            $('#sidedrawer').find('ul li').removeClass('active');
            $('[data-open-panel=' + panel + ']').addClass('active');

            $('[data-panel]').fadeOut('slow', function () {
                setTimeout(function () {
                    $('[data-panel=' + panel + ']').fadeIn('slow');
                    running = false;
                }, 500);
            });
        }
    });

    /**
     * Show the rules page
     */
    $('.showRules').click(function () {
        $('li[data-open-panel="rules"]').click();
    });

    /**
     * Regex test
     */
    $("body").on("settings_loaded", function (event) {
        $('[data-regex-test]').each(function () {
            generateRegex($(this));

            // Tie the keyup event handler to each element
            if (typeof $(this).data('target') !== "undefined" && $(this).data('target') !== '') {
                var element = $(this);
                $($(this).data('target')).keyup(function() {
                    generateRegex(element);
                });
            }
        });

        $('[data-regex-test]').on('click', '.fa-refresh', function(e) {
            e.preventDefault();
            generateRegex($(this).closest('[data-regex-test]'));
        });

        function generateRegex(element) {
            if (typeof element.data('target') !== "undefined" && element.data('target') !== '') {
                var output = new RandExp($(element.data('target')).val()).gen();
                element.html('test output: ' + output + ' <a href="#"><i class="fa fa-refresh" aria-hidden="true" style="cursor: pointer;"></i></a>');
            }
        }
    });

    /**
     * Export settings
     */
    $("#export-settings").click(function () {
        // Save any existing settings
        save();

        var first_attempt = false;
        if ($(this).prop('download') === '' || typeof $(this).prop('download') === 'undefined') {
            first_attempt = true;
        }

        // Compile the settings and prompt to save
        chrome.storage.sync.get(defaultSettings, function (items) {
            var element = $("#export-settings");
            var json    = JSON.stringify(items);
            var blob    = new Blob([json], { type: "application/json" });
            var url     = URL.createObjectURL(blob);

            element.prop('download', "auto-filler-" + moment().format('DDMMYYYYHHmmSS') + ".json");
            element.prop('href', url);

            if (first_attempt) {
                $("#export-settings")[0].click();
            }
        });
    });

    /**
     * Import settings
     */
    $("#import-settings").click(function () {
        $("#import").trigger('click');
    });

    $("#import").change(function() {
        var file = $("#import").prop('files')[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                // Load the settings
                try {
                    var settings = JSON.parse(evt.target.result);
                    if (typeof settings.auto_filler_version !== 'undefined') {
                        // Update and reload the new settings
                        reload(settings);
                        alert("Settings imports successfully!");
                        return true;
                    }
                    alert("Invalid settings file!");
                } catch(e) {
                    alert("Unable to parse settings file!");
                }
                return true;
            }
            reader.onerror = function () {
                alert("Unable to import settings (error reading file)");
                return true;
            }
        }
        return true;
    });

    /**
     * Factory reset
     */
    $(".factory-reset").click(function () {
        if (confirm('Are you sure you want to factory reset Auto Filler?\n\nThis will reset all settings back to their default states.')) {
            chrome.storage.sync.set(defaultSettings, function () {
                alert("Factory reset complete, refreshing...");
                location.reload();
            });
        }
    });
});