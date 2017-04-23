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
});