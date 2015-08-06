; (function ($, window, document, undefined) {

    var pluginName = 'sortpaginate',
        defaults = {
            pageSize: 4
        };

    // The plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {

        var _$this = $(this.element);
        var _opts = this.options;
        
        _$this.wrap("<div class='sp_wrapper'><div class='sp_table'>");

        _$this.parent().after("<div class='sp_navigator'>");

        _$this.closest(".sp_wrapper")
                .find(".sp_navigator")
                .append("<span class='sp_paginate sp_previous'><a href=''>Previous<a/></span>")
                .append("<span class='sp_paginate sp_next'><a href=''>Next<a/></span>");

        function initTable() {
            $(_$this).find("tbody").attr("data-firstRecord", 0);

            $(_$this).closest(".sp_wrapper").find(".sp_navigator .sp_previous").hide();
            $(_$this).closest(".sp_wrapper").find(".sp_navigator .sp_next").show();

            (_$this).find("th").each(function () {
                var width = $(_$this).width() + 80;
                $(_$this).width(width);
            });

            $(_$this).find("th").eq(0).addClass("sp_sorted_asc");

            sortTable($(_$this), 0, "asc");

            paginate(parseInt($(_$this).find("tbody")
                        .attr("data-firstRecord"), 10),
                        _opts.pageSize);

        }

        // Table sorting function
        function sortTable(table, column, order) {
            var asc = order === 'asc';
            var tbody = table.find('tbody');
            
            tbody.find('tr').sort(function (a, b) {
                if (asc) {
                    return $('td:eq(' + column + ')', a)
                        .text()
                        .localeCompare($('td:eq(' + column + ')', b).text());
                } else {
                    return $('td:eq(' + column + ')', b)
                        .text()
                        .localeCompare($('td:eq(' + column + ')', a).text());
                }
            }).appendTo(tbody);
        }

        // Paging function
        var paginate = function (start, size) {
            var tableRows = $(_$this).find("tbody tr");
            var end = start + size;
 
            tableRows.hide();
             tableRows.slice(start, end).show();
             $(_$this).closest(".sp_wrapper").find(".sp_navigator .sp_paginate").show();
 
            if (tableRows.eq(0).is(":visible")) $(_$this).closest(".sp_wrapper").find(".sp_navigator .sp_previous").hide();
             if (tableRows.eq(tableRows.length - 1).is(":visible")) $(_$this).closest(".sp_wrapper").find(".sp_navigator .sp_next").hide();
        }


        // Handling Sorting
        _$this.find("th").on("click", function () {
            $(_$this).find("th").not($(this)).removeClass("sp_sorted_asc sp_sorted_desc");

            if ($(this).hasClass("sp_sorted_asc") || $(this).hasClass("sp_sorted_desc")) {
                $(this).toggleClass("sp_sorted_asc sp_sorted_desc");
            } else {
                $(this).addClass("sp_sorted_asc");
            }

            $(_$this).find("tbody tr").show();

            sortTable($(_$this), $(this).index(), $(this).hasClass("sp_sorted_asc") ? "asc" : "desc");

            paginate(parseInt($(_$this).find("tbody").attr("data-firstRecord"), 10), _opts.pageSize);

        });

        // Handling Pagination
        _$this.closest(".sp_wrapper").find(".sp_navigator").on("click", ".sp_paginate", function (e) {
            e.preventDefault();
            var tableRows = $(_$this).find("tbody tr");
            var tmpRec = parseInt($(_$this).find("tbody").attr("data-firstRecord"), 10);
            
            if ($(this).hasClass("sp_next")) {
                tmpRec += _opts.pageSize;
            } else {
                tmpRec -= _opts.pageSize;
            }

            if (tmpRec < 0 || tmpRec > tableRows.length) return

            $(_$this).find("tbody").attr("data-firstRecord", tmpRec);
            paginate(tmpRec, _opts.pageSize);
        });

        initTable();
    };

    // Plugin wrapper around the constructor, 
    // preventing against multiple instantiations on the same element
    $.fn[pluginName] = function (options) {
        this.each(function () {
            // Check that the element is a table
            if (!$(this).is('table')) return

            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
        });

        return this;
    }

})(jQuery, window, document);



