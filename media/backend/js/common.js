(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

$(document).ready(function() {
    API_PATH = "http://demo.localhost.com/apis/";


    function switch_theme(theme_name) {
        $('#bs-css').attr('href', 'css/bootstrap-' + theme_name + '.css');
    }

    //ajax menu checkbox
    $('#is-ajax').click(function(e) {
        $.cookie('is-ajax', $(this).prop('checked'), {expires: 365});
    });
    $('#is-ajax').prop('checked', $.cookie('is-ajax') === 'true' ? true : false);

    //disbaling some functions for Internet Explorer
    if ($.browser.msie) {
        $('#is-ajax').prop('checked', false);
        $('#for-is-ajax').hide();
        $('#toggle-fullscreen').hide();
        $('.login-box').find('.input-large').removeClass('span10');

    }


    //highlight current / active link
    $('ul.main-menu li a').each(function() {
        if ($($(this))[0].href == String(window.location))
            $(this).parent().addClass('active');
    });

    //establish history variables
    var
            History = window.History, // Note: We are using a capital H instead of a lower h
            State = History.getState(),
            $log = $('#log');

    //bind to State Change
    History.Adapter.bind(window, 'statechange', function() { // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        $.ajax({
            url: State.url,
            success: function(msg) {
                $('#content').html($(msg).find('#content').html());
                $('#loading').remove();
                $('#content').fadeIn();
                var newTitle = $(msg).filter('title').text();
                $('title').text(newTitle);
                docReady();
            }
        });
    });

    //ajaxify menus
    $('a.ajax-link').click(function(e) {
        if ($.browser.msie)
            e.which = 1;
        if (e.which != 1 || !$('#is-ajax').prop('checked') || $(this).parent().hasClass('active'))
            return;
        e.preventDefault();
        if ($('.btn-navbar').is(':visible'))
        {
            $('.btn-navbar').click();
        }
        $('#loading').remove();
        $('#content').fadeOut().parent().append('<div id="loading" class="center">Loading...<div class="center"></div></div>');
        var $clink = $(this);
        History.pushState(null, null, $clink.attr('href'));
        $('ul.main-menu li.active').removeClass('active');
        $clink.parent('li').addClass('active');
    });

    //animating menus on hover
    $('ul.main-menu li:not(.nav-header)').hover(function() {
        $(this).animate({'margin-left': '+=5'}, 300);
    },
            function() {
                $(this).animate({'margin-left': '-=5'}, 300);
            });



    //other things to do on document ready, seperated for ajax calls
    docReady();
});


function docReady() {
    //prevent # links from moving to top
    $('a[href="#"][data-top!=true]').click(function(e) {
        e.preventDefault();
    });

    //rich text editor
    $('.cleditor').cleditor();

    //datepicker
    //$('.datepicker').datepicker();
    var dateToday = new Date();
    $('.datepicker').datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        minDate: dateToday
                /*onSelect: function(selectedDate) {
                 var option = this.id == "from" ? "minDate" : "maxDate",
                 instance = $(this).data("datepicker"),
                 date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
                 dates.not(this).datepicker("option", option, date);
                 }*/
    });

    //notifications
    $('.noty').click(function(e) {
        e.preventDefault();
        var options = $.parseJSON($(this).attr('data-noty-options'));
        noty(options);
    });


    //uniform - styler for checkbox, radio and file input
    //$("input:checkbox, input:radio, input:file").not('[data-no-uniform="true"],#uniform-is-ajax').uniform();

    //chosen - improves select
    $('[data-rel="chosen"],[rel="chosen"]').chosen({ disable_search_threshold: 10, search_contains: true });

    //tabs
    $('#myTab a:first').tab('show');
    $('#myTab a').click(function(e) {
        e.preventDefault();
//alert(this);
        $(this).tab('show');
    });

    $('#jobTab a:first').tab('show');


    $('#jobTab a').click(function(e) {
        currentTab = $("#current_tab").val();
        resetTabs = false;
        e.preventDefault();

        job_id = $("#job_id").val();

        if (job_id <= 0) {
            if (currentTab == "job_step_1") {
                insertJobData();
            } else {
                $("#job_step_1").tab('show');
                resetTabs = true;
            }
        } else {
            updateJobData(this.id);
        }

        if (!resetTabs) {
            $(this).tab('show');
        }
        $("#current_tab").val(this.id);
    });


    function insertJobData() {
        var jobsData = {
            "title": $("#jobTitle").val(),
            "description": $("#jobDescription").val(),
            "start_date": $("#startDate").val(),
            "expiry_date": $("#expiryDate").val(),
            "locations": $("#locations").val(),
            "city": $("#city").val(),
            "employment_type": $("#employmentType").val(),
            "vacancies": $("#vacancies").val(),
            "manages": $("#manages").attr('checked')
        };



        $.ajax({
            type: "POST", // you request will be a post request
            data: jobsData, // javascript object with all my params
            url: API_PATH + "saveJobs", // my backoffice comunication api url
            dataType: "json", // datatype can be json or jsonp
            success: function(result) {
                $("#job_id").val(result);
                //console.dir(result);
            }
        });




//alert(jobsData);
    }



    function updateJobData(step) {


    }

    //makes elements soratble, elements that sort need to have id attribute to save the result
    $('.sortable').sortable({
        revert: true,
        cancel: '.btn,.box-content,.nav-header',
        update: function(event, ui) {
            //line below gives the ids of elements, you can make ajax call here to save it to the database
            //console.log($(this).sortable('toArray'));
        }
    });

    //slider
    $('.slider').slider({range: true, values: [10, 65]});

    //tooltip
    $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({"placement": "bottom", delay: {show: 400, hide: 200}});

    //auto grow textarea
    $('textarea.autogrow').autogrow();

    //popover
    $('[rel="popover"],[data-rel="popover"]').popover();

    //file manager
    /*var elf = $('.file-manager').elfinder({
        url: 'misc/elfinder-connector/connector.php'  // connector URL (REQUIRED)
    }).elfinder('instance');

    //iOS / iPhone style toggle switch
    $('.iphone-toggle').iphoneStyle();

    //star rating
    $('.raty').raty({
        score: 4 //default stars
    });*/

    //uploadify - multiple uploads
    $('#file_upload').uploadify({
        'swf': 'misc/uploadify.swf',
        'uploader': 'misc/uploadify.php'
                // Put your options here
    });

    //gallery controlls container animation
    $('ul.gallery li').hover(function() {
        $('img', this).fadeToggle(1000);
        $(this).find('.gallery-controls').remove();
        $(this).append('<div class="well gallery-controls">' +
                '<p><a href="#" class="gallery-edit btn"><i class="icon-edit"></i></a> <a href="#" class="gallery-delete btn"><i class="icon-remove"></i></a></p>' +
                '</div>');
        $(this).find('.gallery-controls').stop().animate({'margin-top': '-1'}, 400, 'easeInQuint');
    }, function() {
        $('img', this).fadeToggle(1000);
        $(this).find('.gallery-controls').stop().animate({'margin-top': '-30'}, 200, 'easeInQuint', function() {
            $(this).remove();
        });
    });


    //gallery image controls example
    //gallery delete
    $('.thumbnails').on('click', '.gallery-delete', function(e) {
        e.preventDefault();
        //get image id
        //alert($(this).parents('.thumbnail').attr('id'));
        $(this).parents('.thumbnail').fadeOut();
    });
    //gallery edit
    $('.thumbnails').on('click', '.gallery-edit', function(e) {
        e.preventDefault();
        //get image id
        //alert($(this).parents('.thumbnail').attr('id'));
    });

    //gallery colorbox
    $('.thumbnail a').colorbox({rel: 'thumbnail a', transition: "elastic", maxWidth: "95%", maxHeight: "95%"});

    //gallery fullscreen
    $('#toggle-fullscreen').button().click(function() {
        var button = $(this), root = document.documentElement;
        if (!button.hasClass('active')) {
            $('#thumbnails').addClass('modal-fullscreen');
            if (root.webkitRequestFullScreen) {
                root.webkitRequestFullScreen(
                        window.Element.ALLOW_KEYBOARD_INPUT
                        );
            } else if (root.mozRequestFullScreen) {
                root.mozRequestFullScreen();
            }
        } else {
            $('#thumbnails').removeClass('modal-fullscreen');
            (document.webkitCancelFullScreen ||
                    document.mozCancelFullScreen ||
                    $.noop).apply(document);
        }
    });

    //tour
    if ($('.tour').length && typeof(tour) == 'undefined')
    {
        var tour = new Tour();
        tour.addStep({
            element: ".span10:first", /* html element next to which the step popover should be shown */
            placement: "top",
            title: "Custom Tour", /* title of the popover */
            content: "You can create tour like this. Click Next." /* content of the popover */
        });
        tour.addStep({
            element: ".theme-container",
            placement: "left",
            title: "Themes",
            content: "You change your theme from here."
        });
        tour.addStep({
            element: "ul.main-menu a:first",
            title: "Dashboard",
            content: "This is your dashboard from here you will find highlights."
        });
        tour.addStep({
            element: "#for-is-ajax",
            title: "Ajax",
            content: "You can change if pages load with Ajax or not."
        });
        tour.addStep({
            element: ".top-nav a:first",
            placement: "bottom",
            title: "Visit Site",
            content: "Visit your front end from here."
        });

        tour.restart();
    }
    
    /* Bootstrap style pagination control */
    $.extend($.fn.dataTableExt.oPagination, {
      "bootstrap": {
        "fnInit": function(oSettings, nPaging, fnDraw) {
          var oLang = oSettings.oLanguage.oPaginate;
          var fnClickHandler = function(e) {
            e.preventDefault();
            if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
              fnDraw(oSettings);
            }
          };

          $(nPaging).append(
            '<ul class="pagination">' +
            '<li class="first disabled"><a href="#">' + oLang.sFirst + '</a></li>' +
            '<li class="prev  disabled"><a href="#">' + oLang.sPrevious + '</a></li>' +
            '<li class="next  disabled"><a href="#">' + oLang.sNext + '</a></li>' +
            '<li class="last  disabled"><a href="#">' + oLang.sLast + '</a></li>' +
            '</ul>'
          );
          var els = $('a', nPaging);
          $(els[0]).bind('click.DT', {
            action: "first"
          }, fnClickHandler);
          $(els[1]).bind('click.DT', {
            action: "previous"
          }, fnClickHandler);
          $(els[2]).bind('click.DT', {
            action: "next"
          }, fnClickHandler);
          $(els[3]).bind('click.DT', {
            action: "last"
          }, fnClickHandler);
        },

        "fnUpdate": function(oSettings, fnDraw) {
          var iListLength = 5;
          var oPaging = oSettings.oInstance.fnPagingInfo();
          var an = oSettings.aanFeatures.p;
          var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

          if (oPaging.iTotalPages < iListLength) {
            iStart = 1;
            iEnd = oPaging.iTotalPages;
          } else if (oPaging.iPage <= iHalf) {
            iStart = 1;
            iEnd = iListLength;
          } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
            iStart = oPaging.iTotalPages - iListLength + 1;
            iEnd = oPaging.iTotalPages;
          } else {
            iStart = oPaging.iPage - iHalf + 1;
            iEnd = iStart + iListLength - 1;
          }

          for (i = 0, iLen = an.length; i < iLen; i++) {
            // Remove the middle elements
            $('li:gt(1)', an[i]).filter(':not(.next,.last)').remove();

            // Add the new list items and their event handlers
            for (j = iStart; j <= iEnd; j++) {
              var act = "";
              if (j == oPaging.iPage + 1) {
                act = 'class="active"';
              }
              $('<li ' + act + '<a href="/ref#sClass"></a>' + '<a href="#">' + j + '</a></li>')
                .insertBefore($('.next,.last', an[i])[0])
                .bind('click', function(e) {
                  e.preventDefault();
                  oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                  fnDraw(oSettings);
                });
            }

            // Add / remove disabled classes from the static elements
            if (oPaging.iPage === 0) {
              $('li:first', an[i]).addClass('disabled');
              $('li.prev').addClass('disabled');
            } else {
              $('li:first', an[i]).removeClass('disabled');
              $('li.prev').removeClass('disabled');
            }

            if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
              $('li:last', an[i]).addClass('disabled');
              $('li.next').addClass('disabled');
            } else {
              $('li:last', an[i]).removeClass('disabled');
              $('li.next').removeClass('disabled');
            }
          }
        }
      }
    });

    //datatable
    /*$('.datatable').dataTable({
        
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
        //"sPaginationType": "full_numbers",
        "sPaginationType": "bootstrap",
        //"bJQueryUI": true,
        "bSort": false,
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
        }
    });*/
    $('.btn-close').click(function(e) {
        e.preventDefault();
        $(this).parent().parent().parent().fadeOut();
    });
    $('.btn-minimize').click(function(e) {
        e.preventDefault();
        var $target = $(this).parent().parent().next('.box-content');
        if ($target.is(':visible'))
            $('i', $(this)).removeClass('icon-chevron-up').addClass('icon-chevron-down');
        else
            $('i', $(this)).removeClass('icon-chevron-down').addClass('icon-chevron-up');
        $target.slideToggle();
    });
    $('.btn-setting').click(function(e) {
        e.preventDefault();
        $('#myModal').modal('show');
    });




    //initialize the external events for calender

    $('#external-events div.external-event').each(function() {

        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });

    });


    //initialize the calendar
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function(date, allDay) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }

        }
    });


    //chart with points
    if ($("#sincos").length)
    {
        var sin = [], cos = [];

        for (var i = 0; i < 14; i += 0.5) {
            sin.push([i, Math.sin(i) / i]);
            cos.push([i, Math.cos(i)]);
        }

        var plot = $.plot($("#sincos"),
                [{data: sin, label: "sin(x)/x"}, {data: cos, label: "cos(x)"}], {
            series: {
                lines: {show: true},
                points: {show: true}
            },
            grid: {hoverable: true, clickable: true, backgroundColor: {colors: ["#fff", "#eee"]}},
            yaxis: {min: -1.2, max: 1.2},
            colors: ["#539F2E", "#3C67A5"]
        });

        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 5,
                border: '1px solid #fdd',
                padding: '2px',
                'background-color': '#dfeffc',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $("#sincos").bind("plothover", function(event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                            y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY,
                            item.series.label + " of " + x + " = " + y);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });



        $("#sincos").bind("plotclick", function(event, pos, item) {
            if (item) {
                $("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
                plot.highlight(item.series, item.datapoint);
            }
        });
    }

    //flot chart
    if ($("#flotchart").length)
    {
        var d1 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.25)
            d1.push([i, Math.sin(i)]);

        var d2 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.25)
            d2.push([i, Math.cos(i)]);

        var d3 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.1)
            d3.push([i, Math.tan(i)]);

        $.plot($("#flotchart"), [
            {label: "sin(x)", data: d1},
            {label: "cos(x)", data: d2},
            {label: "tan(x)", data: d3}
        ], {
            series: {
                lines: {show: true},
                points: {show: true}
            },
            xaxis: {
                ticks: [0, [Math.PI / 2, "\u03c0/2"], [Math.PI, "\u03c0"], [Math.PI * 3 / 2, "3\u03c0/2"], [Math.PI * 2, "2\u03c0"]]
            },
            yaxis: {
                ticks: 10,
                min: -2,
                max: 2
            },
            grid: {
                backgroundColor: {colors: ["#fff", "#eee"]}
            }
        });
    }

    //stack chart
    if ($("#stackchart").length)
    {
        var d1 = [];
        for (var i = 0; i <= 10; i += 1)
            d1.push([i, parseInt(Math.random() * 30)]);

        var d2 = [];
        for (var i = 0; i <= 10; i += 1)
            d2.push([i, parseInt(Math.random() * 30)]);

        var d3 = [];
        for (var i = 0; i <= 10; i += 1)
            d3.push([i, parseInt(Math.random() * 30)]);

        var stack = 0, bars = true, lines = false, steps = false;

        function plotWithOptions() {
            $.plot($("#stackchart"), [d1, d2, d3], {
                series: {
                    stack: stack,
                    lines: {show: lines, fill: true, steps: steps},
                    bars: {show: bars, barWidth: 0.6}
                }
            });
        }

        plotWithOptions();

        $(".stackControls input").click(function(e) {
            e.preventDefault();
            stack = $(this).val() == "With stacking" ? true : null;
            plotWithOptions();
        });
        $(".graphControls input").click(function(e) {
            e.preventDefault();
            bars = $(this).val().indexOf("Bars") != -1;
            lines = $(this).val().indexOf("Lines") != -1;
            steps = $(this).val().indexOf("steps") != -1;
            plotWithOptions();
        });
    }



    //donut chart
    if ($("#donutchart").length)
    {
        $.plot($("#donutchart"), data,
                {
                    series: {
                        pie: {
                            innerRadius: 0.5,
                            show: true
                        }
                    },
                    legend: {
                        show: false
                    }
                });
    }




    // we use an inline data source in the example, usually data would
    // be fetched from a server
    var data = [], totalPoints = 300;
    function getRandomData() {
        if (data.length > 0)
            data = data.slice(1);

        // do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50;
            var y = prev + Math.random() * 10 - 5;
            if (y < 0)
                y = 0;
            if (y > 100)
                y = 100;
            data.push(y);
        }

        // zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i)
            res.push([i, data[i]])
        return res;
    }

    // setup control widget
    var updateInterval = 30;
    $("#updateInterval").val(updateInterval).change(function() {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1)
                updateInterval = 1;
            if (updateInterval > 2000)
                updateInterval = 2000;
            $(this).val("" + updateInterval);
        }
    });

    //realtime chart
    if ($("#realtimechart").length)
    {
        var options = {
            series: {shadowSize: 1}, // drawing is faster without shadows
            yaxis: {min: 0, max: 100},
            xaxis: {show: false}
        };
        var plot = $.plot($("#realtimechart"), [getRandomData()], options);
        function update() {
            plot.setData([getRandomData()]);
            // since the axes don't change, we don't need to call plot.setupGrid()
            plot.draw();

            setTimeout(update, updateInterval);
        }

        update();
    }
}


//additional functions for data table
$.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings)
{
    return {
        "iStart": oSettings._iDisplayStart,
        "iEnd": oSettings.fnDisplayEnd(),
        "iLength": oSettings._iDisplayLength,
        "iTotal": oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
        "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
    };
}
$.extend($.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function(oSettings, nPaging, fnDraw) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function(e) {
                e.preventDefault();
                if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                    fnDraw(oSettings);
                }
            };

            $(nPaging).addClass('pagination').append(
                    '<ul>' +
                    '<li class="prev disabled"><a href="#">&larr; ' + oLang.sPrevious + '</a></li>' +
                    '<li class="next disabled"><a href="#">' + oLang.sNext + ' &rarr; </a></li>' +
                    '</ul>'
                    );
            var els = $('a', nPaging);
            $(els[0]).bind('click.DT', {action: "previous"}, fnClickHandler);
            $(els[1]).bind('click.DT', {action: "next"}, fnClickHandler);
        },
        "fnUpdate": function(oSettings, fnDraw) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

            if (oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if (oPaging.iPage <= iHalf) {
                iStart = 1;
                iEnd = iListLength;
            } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            for (i = 0, iLen = an.length; i < iLen; i++) {
                // remove the middle elements
                $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                // add the new list items and their event handlers
                for (j = iStart; j <= iEnd; j++) {
                    sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                    $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                            .insertBefore($('li:last', an[i])[0])
                            .bind('click', function(e) {
                        e.preventDefault();
                        oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                        fnDraw(oSettings);
                    });
                }

                // add / remove disabled classes from the static elements
                if (oPaging.iPage === 0) {
                    $('li:first', an[i]).addClass('disabled');
                } else {
                    $('li:first', an[i]).removeClass('disabled');
                }

                if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                    $('li:last', an[i]).addClass('disabled');
                } else {
                    $('li:last', an[i]).removeClass('disabled');
                }
            }
        }
    }
});