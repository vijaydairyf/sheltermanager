/*jslint browser: true, forin: true, eqeq: true, white: true, sloppy: true, vars: true, nomen: true */
/*global $, Mousetrap, _, asm, common, config, controller, format, html */
/*global header: true */

$(function() {

    // If this is the login or database create page, don't do anything - they don't have headers, 
    // but for the sake of making life easy, they still include this file.
    if (common.current_url().indexOf("/login") != -1 ||
        common.current_url().indexOf("/database") != -1) {
        return;
    }

    var QUICKLINKS_SET = {
        1: ["animal_find", "asm-icon-animal-find", _("Find animal")],
        2: ["animal_new", "asm-icon-animal-add", _("Add a new animal")],
        3: ["log_new", "asm-icon-log", _("Add a log entry")],
        4: ["litters", "asm-icon-litter", _("Edit litters")],
        5: ["person_find", "asm-icon-person-find", _("Find person")],
        6: ["person_new", "asm-icon-person-add", _("Add a new person")],
        7: ["lostanimal_find", "asm-icon-animal-lost-find", _("Find a lost animal")],
        8: ["foundanimal_find", "asm-icon-animal-found-find", _("Find a found animal")],
        9: ["lostanimal_new", "asm-icon-animal-lost-add", _("Add a lost animal")],
        10: ["foundanimal_new", "asm-icon-animal-found-add", _("Add a found animal")],
        11: ["lostfound_match", "asm-icon-match", _("Match lost and found animals")],
        12: ["diary_edit_my?newnote=1", "asm-icon-diary", _("Add a diary note")],
        13: ["diary_edit_my", "asm-icon-diary", _("My diary notes")],
        14: ["diary_edit", "asm-icon-diary", _("All diary notes")],
        15: ["diarytasks", "asm-icon-diary-task", _("Edit diary tasks")],
        16: ["waitinglist_new", "asm-icon-waitinglist", _("Add an animal to the waiting list")],
        17: ["waitinglist_results", "asm-icon-waitinglist", _("Edit the current waiting list")],
        18: ["move_reserve", "asm-icon-reservation", _("Reserve an animal")],
        19: ["move_foster", "", _("Foster an animal")],
        20: ["move_adopt", "asm-icon-person", _("Adopt an animal")],
        21: ["move_deceased", "asm-icon-death", _("Mark an animal deceased")],
        22: ["move_book_recent_adoption", "", _("Return an animal from adoption")],
        23: ["move_book_recent_other", "", _("Return an animal from another movement")],
        24: ["move_book_reservation", "asm-icon-reservation", _("Reservation book")],
        25: ["move_book_foster", "asm-icon-book", _("Foster book")],
        26: ["move_book_retailer", "asm-icon-book", _("Retailer book")],
        27: ["vaccination?newvacc=1", "", _("Add a vaccination")],
        28: ["vaccination", "asm-icon-vaccination", _("Vaccination book")],
        29: ["medical?newmed=1", "", _("Add a medical regimen")],
        30: ["medical", "asm-icon-medical", _("Medical book")],
        32: ["publish_options", "asm-icon-settings", _("Set publishing options")],
        31: ["search?q=forpublish", "asm-icon-animal", _("Up for adoption")],
        33: ["search?q=deceased", "asm-icon-death", _("Recently deceased")],
        34: ["search?q=notforadoption", "", _("Not for adoption")],
        35: ["search?q=onshelter", "asm-icon-animal", _("Shelter animals")],
        36: ["accounts", "asm-icon-accounts", _("Accounts")],
        37: ["donation_receive", "asm-icon-donation", _("Receive a payment")],
        38: ["move_transfer", "", _("Transfer an animal")],
        39: ["medicalprofile", "", _("Medical profiles")],
        40: ["shelterview", "asm-icon-location", _("Shelter view")],
        41: ["move_book_trial_adoption", "asm-icon-trial", _("Trial adoption book")],
        42: ["incident_new", "asm-icon-call", _("Report a new incident")],
        43: ["incident_find", "asm-icon-call", _("Find an incident")],
        44: ["incident_map", "asm-icon-map", _("Map of active incidents")],
        45: ["traploan?filter=active", "asm-icon-traploan", _("Trap loans")],
        46: ["calendarview", "asm-icon-calendar", _("Calendar view")],
        47: ["calendarview?ev=d", "asm-icon-calendar", _("Diary calendar")],
        48: ["calendarview?ev=vmt", "asm-icon-calendar", _("Medical calendar")],
        49: ["calendarview?ev=p", "asm-icon-calendar", _("Payment calendar")],
        50: ["calendarview?ev=ol", "asm-icon-calendar", _("Animal control calendar")],
        51: ["stocklevel", "asm-icon-stock", _("Stock Levels")],
        52: ["transport", "asm-icon-transport", _("Transport Book")],
        53: ["timeline", "asm-icon-calendar", _("Timeline")],
        54: ["staff_rota", "asm-icon-rota", _("Staff Rota")]
    };

    /** Functions related to rendering and binding to events for the page
     *  header for all screens (menu, search, etc).
     */
    header = {

        show_error: function(text) {
            $("#asm-topline-error-text").html(text);
            $("#asm-topline-error").fadeIn("slow");
        },

        hide_error: function() {
            $("#asm-topline-error").hide();
        },

        show_info: function(text, duration) {
            if (!duration) { duration = 5000; }
            $("#asm-topline-info-text").html(text);
            $("#asm-topline-info").fadeIn("slow").delay(duration).fadeOut("slow");
        },

        show_loading: function(text) {
            if (text !== undefined && text !== null && text !== "") {
                $("#asm-topline-loading-text").text(text);
            }
            $("#asm-topline-loading").dialog({
                dialogClass: 'dialog-no-title',
                height: 200,
                modal: true
            });
        },

        hide_loading: function() {
            $("#asm-topline-loading").dialog("close");
        },

        menu_html: function() {
            var menu = [], menus = [];
            // Renders menu items as a flat structure in with one or more columns
            var menu_html_flat = function(items) {
                menus.push("<div class=\"asm-menu-columns\">");
                menus.push("<div class=\"asm-menu-column\">");
                menus.push("<ul class=\"asm-menu-list\">");
                $.each(items, function(i, v) {
                    var permission = v[0], accesskey = v[1], classes = v[2], url = v[3], icon = v[4], display = v[5], iconhtml = "";
                    if (asm.superuser || asm.securitymap.indexOf(permission + " ") != -1) {
                        if (url == "-") {
                            menus.push("<hr class=\"asm-menu-body-rule\" />\n");
                        }
                        else if (url == "--break") {
                            menus.push("</ul>\n</div>\n<div class=\"asm-menu-column\">\n<ul class=\"asm-menu-list\">");
                        }
                        else if (url == "--cat") {
                            if (icon != "") { 
                                iconhtml = "<span class=\"asm-icon " + icon + "\"></span>\n";
                            }
                            menus.push("<li class=\"asm-menu-category " + classes + "\">" + iconhtml + " " + display + "</li>");
                        }
                        else {
                            if (icon != "") {
                                iconhtml = "<span class=\"asm-icon " + icon + "\"></span>";
                            }
                            var accesskeydisp = "", target = "";
                            if (accesskey != "") {
                                accesskeydisp = "<span class=\"asm-hotkey\">" + accesskey.toUpperCase() + "</span>";
                                Mousetrap.bind(accesskey, function(e) {
                                    window.location = url;
                                    return false;
                                });
                            }
                            if (url.indexOf("report") == 0 && config.bool("ReportNewBrowserTab")) {
                                target = " target=\"_blank\"";
                            }
                            menus.push("<li class=\"asm-menu-item " + classes + "\"><a href=\"" + url + "\" " + target + ">" + iconhtml + " " + display + accesskeydisp + "</a></li>");
                        }
                    }
                });
                menus.push("</ul>\n</div>\n</div>\n");
            };
            // Renders menu items where each category becomes an accordion section **/
            var menu_html_accordion = function(name, items) {
                var openac = false, outputhead = false;
                $.each(items, function(i, v) {
                    var permission = v[0], accesskey = v[1], classes = v[2], url = v[3], icon = v[4], display = v[5], iconhtml = "";
                    if (asm.superuser || asm.securitymap.indexOf(permission + " ") != -1) {
                        if (url == "--cat") {
                            if (!outputhead) { 
                                menus.push("<div class=\"asm-menu-accordion asm-menu-accordion-" + name + "\">");
                                outputhead = true;
                            }
                            if (openac) { menus.push("</ul></div>"); }
                            if (icon != "") { 
                                iconhtml = "<span class=\"asm-icon " + icon + "\"></span>\n";
                            }
                            menus.push("<h3>" + iconhtml + " " + display + "</h3>");
                            menus.push("<div>");
                            menus.push('<ul class="asm-menu-list">');
                            openac = true;
                        }
                        else {
                            if (icon != "") {
                                iconhtml = "<span class=\"asm-icon " + icon + "\"></span>";
                            }
                            var accesskeydisp = "", target = "";
                            if (accesskey != "") {
                                accesskeydisp = "<span class=\"asm-hotkey\">" + accesskey.toUpperCase() + "</span>";
                                Mousetrap.bind(accesskey, function(e) {
                                    window.location = url;
                                    return false;
                                });
                            }
                            if (url.indexOf("report") == 0 && config.bool("ReportNewBrowserTab")) {
                                target = " target=\"_blank\"";
                            }
                            menus.push("<li class=\"asm-menu-item " + classes + "\"><a href=\"" + url + "\" " + target + ">" + iconhtml + " " + display + accesskeydisp + "</a></li>");
                        }
                    }
                });
                menus.push("</ul>\n</div>\n</div>");
            };
            // Go through each menu and render appropriately
            $.each(asm.menustructure, function(im, vm) {
                var permission = vm[0], name = vm[1], display = vm[2], items = vm[3];
                if (asm.superuser || asm.securitymap.indexOf(permission + " ") != -1) {
                    // Render the menu button and body
                    menu.push("<span id=\"asm-menu-" + name + "\" class=\"asm-menu-icon\">" + display + "</span>");
                    menus.push("<div id=\"asm-menu-" + name + "-body\" class=\"asm-menu-body\">");
                    if (name != "reports" && name != "mailmerge") {
                        menu_html_flat(items);
                    }
                    else {
                        menu_html_accordion(name, items);
                    }
                    menus.push("</div>");
                }
            });
            return [ "<div id=\"asm-menu\" style=\"display: none\">\n" + menu.join("") + "</div>\n", menus.join("\n") ];
        },

        /** Finds all menu widgets (have classes of asm-menu-icon and asm-menu-body) and
         * initialises them into dropdown menus. This should be called by the render
         * function after menu_html so that the DOM contains all necessary elements.
         */
        menu_widgets: function() {

            $(".asm-menu-icon").asmmenu();
            $(".asm-menu-accordion").accordion({ active: false, collapsible: true, heightStyle: "content" });

            // Hide inactive publishers
            var ep = "";
            try {
                ep = config.str("PublishersEnabled");
            }
            catch(ip) {}

            // Meetapet, PetFinder and PetLink are US/Canada/Mexico
            if (asm.locale != "en" && asm.locale != "en_CA" && asm.locale != "es_MX" && asm.locale != "en_MX") {
                ep.replace("mp", "");
                ep.replace("pf", "");
                ep.replace("pl", "");
            }

            // AdoptAPet, Pets911, RescueGroups, SmartTag and VetEnvoy/US are US only
            if (asm.locale != "en") {
                ep.replace("ap", "");
                ep.replace("p911", "");
                ep.replace("rg", "");
                ep.replace("st", "");
                ep.replace("ve", "");
            }

            // PetRescue is AU only
            if (asm.locale != "en_AU") {
                ep.replace("pr", "");
            }

            // PETtrac UK
            if (asm.locale != "en_GB") {
                ep.replace("ptuk", "");
            }

            // Anibase UK
            if (asm.locale != "en_GB") {
                ep.replace("abuk", "");
            }

            if (ep.indexOf("html") == -1) { $("#asm-menu-publishing-body [href='publish?mode=ftp']").closest("li").hide(); }
            if (ep.indexOf("pf") == -1) { $("#asm-menu-publishing-body [href='publish?mode=pf']").closest("li").hide(); }
            if (ep.indexOf("abuk") == -1) { $("#asm-menu-publishing-body [href='publish?mode=abuk']").closest("li").hide(); }
            if (ep.indexOf("ap") == -1) { $("#asm-menu-publishing-body [href='publish?mode=ap']").closest("li").hide(); }
            if (ep.indexOf("p911") == -1) { $("#asm-menu-publishing-body [href='publish?mode=p9']").closest("li").hide(); }
            if (ep.indexOf("rg") == -1) { $("#asm-menu-publishing-body [href='publish?mode=rg']").closest("li").hide(); }
            if (ep.indexOf("mp") == -1) { $("#asm-menu-publishing-body [href='publish?mode=mp']").closest("li").hide(); }
            if (ep.indexOf("hlp") == -1) { $("#asm-menu-publishing-body [href='publish?mode=hlp']").closest("li").hide(); }
            if (ep.indexOf("pl") == -1) { $("#asm-menu-publishing-body [href='publish?mode=pl']").closest("li").hide(); }
            if (ep.indexOf("pr") == -1) { $("#asm-menu-publishing-body [href='publish?mode=pr']").closest("li").hide(); }
            if (ep.indexOf("ptuk") == -1) { $("#asm-menu-publishing-body [href='publish?mode=ptuk']").closest("li").hide(); }
            if (ep.indexOf("st") == -1) { $("#asm-menu-publishing-body [href='publish?mode=st']").closest("li").hide(); }
            if (ep.indexOf("ve") == -1) { 
                $("#asm-menu-publishing-body [href='publish?mode=vear']").closest("li").hide(); 
                $("#asm-menu-publishing-body [href='publish?mode=veha']").closest("li").hide(); 
            }

            try {
                // If movements are disabled, remove the move menu
                if (config.bool("DisableMovements")) {
                    $("#asm-menu-move").closest("td").hide();
                }
                // If lost and found is disabled, hide menu entries for it
                if (config.bool("DisableLostAndFound")) {
                    $(".taglostfound").hide();  
                }
                // If retailer is disabled, hide menu entries for it
                if (config.bool("DisableRetailer")) {
                    $(".tagretailer").hide();
                }
                // If rota is disabled, hide menu entries for it
                if (config.bool("DisableRota")) {
                    $(".tagrota").hide();
                }
                // If transport is disabled, hide menu entries for it
                if (config.bool("DisableTransport")) {
                    $(".tagtransport").hide();
                }
                // If trial adoptions are not enabled, hide any menu entries
                if (!config.bool("TrialAdoptions")) {
                    $(".tagtrial").hide();
                }
                // Same for waiting list
                if (config.bool("DisableWaitingList")) {
                    $(".tagwaitinglist").hide();
                }
                // Document repo
                if (config.bool("DisableDocumentRepo")) {
                    $(".tagdocumentrepo").hide();
                }
                // Online forms
                if (config.bool("DisableOnlineForms")) {
                    $(".tagonlineform").hide();
                }
                // Animal Control
                if (config.bool("DisableAnimalControl")) {
                    $(".taganimalcontrol").hide();
                }
                // Trap Loans
                if (config.bool("DisableTrapLoan")) {
                    $(".tagtraploan").hide();
                }
                // Animal control header (either animal control or incidents enabled)
                if (config.bool("DisableTrapLoan") && config.bool("DisableAnimalControl")) {
                    $(".taganimalcontrolheader").hide();
                }
                // Accounts
                if (config.bool("DisableAccounts")) {
                    $(".tagaccounts").hide();
                    // If nothing is enabled, hide the whole financial menu
                    if (config.bool("DisableStockControl")) { $("#asm-menu-financial").hide(); }
                }
                // Stock Control
                if (config.bool("DisableStockControl")) {
                    $(".tagstock").hide();
                }
                // HMRC Gift Aid is en_GB only
                if (asm.locale != "en_GB") {
                    $(".taggb").hide();
                }
            }
            catch (nc) {}
            $("#asm-menu").show();
        },

        /**
         * Renders quicklinks as html
         */
        quicklinks_html:  function() {
            var qls = config.str("QuicklinksID"), s = "";
            $.each(qls.split(","), function(i, v) {
                var b = QUICKLINKS_SET[parseInt(v, 10)];
                var url = b[0], image = b[1], text = b[2];
                s += "<a ";
                s += "href='" + url + "'>";
                if (image != "") {
                    s += "<span class='asm-icon " + image + "'></span> ";
                }
                s += text + "</a>\n";
            });
            return s;
        },

        /**
         * Render HTML components of the header
         */
        render: function() {
            var homeicon = "static/images/logo/icon-32.png",
                mh = this.menu_html(),
                menubuttons = mh[0],
                menubodies = mh[1];
            if (asm.hascustomlogo) {
                homeicon = "image?db=" + asm.useraccount + "&mode=dbfs&id=/reports/logo.jpg";
            }
            var h = [
                '<div id="asm-topline" class="no-print" style="display: none">',
                    '<div class="topline-element">',
                        '<a id="asm-topline-logo" href="main" title="' + _("Home") + '"><img src="' + homeicon + '" /></a>',
                    '</div> ',
                    '<div class="topline-element">',
                        menubuttons,
                    '</div> ',
                    '<div class="topline-element">',
                        '<span style="white-space: nowrap">',
                        '<input id="topline-q" name="q" type="text" class="asm-textbox" title="' + _("Search") + '" value="' + _("Search") + '" />',
                        '<a id="searchgo" title="',
                        _("filters: a:animal, p:person, wl:waitinglist, la:lostanimal, fa:foundanimal keywords: onshelter/os, notforadoption, donors, deceased, vets, retailers, staff, fosterers, volunteers, homecheckers, members, activelost, activefound"),
                        '"><span class="asm-icon asm-icon-search"></span></a>',
                        '</span>',
                    '</div>',
                    '<div class="topline-user-element">',
                        '<span id="asm-topline-user" class="asm-menu-icon"><img id="asm-topline-flag" /> <span id="asm-topline-username"></span></span>',
                    '</div>',
                '</div>',
                menubodies,
                '<div id="asm-topline-user-body" class="asm-menu-body">',
                    '<ul class="asm-menu-list">',
                        '<li class="asm-menu-category">' + _("Help") + '</li>',
                        '<li class="asm-menu-item"><a href="static/pages/manual/index.html" target="_blank"><span class="asm-icon asm-icon-help"></span> <nobr>' + _("View Manual") + '</nobr></a></li>',
                        '<li class="asm-menu-item"><a href="http://youtube.com/user/sheltermanager" target="_blank"><nobr><span class="asm-icon asm-icon-youtube"></span> ' + _("View Training Videos") + '</nobr></a></li>',
                        '<li class="asm-menu-item"><a href="static/pages/manual/faq.html" target="_blank"><nobr><span class="asm-icon asm-icon-faq"></span> ' + _("Frequently Asked Questions") + '</nobr></a></li>',
                        '<li class="asm-menu-category">' + asm.user + '</li>',
                        '<li id="asm-mysmcom" class="asm-menu-item"><a href="/my" target="_blank"><nobr><span class="asm-icon asm-icon-logo"></span> ' + _("My sheltermanager.com account") + '</nobr></a></li>',
                        '<li class="asm-menu-item"><a href="change_password"><nobr><span class="asm-icon asm-icon-auth"></span> ' + _("Change Password") + '</nobr></a></li>',
                        '<li class="asm-menu-item"><a href="change_user_settings"><nobr><span class="asm-icon asm-icon-settings"></span> ' + _("Change User Settings") + '</nobr></a></li>',
                        '<li class="asm-menu-item"><a href="logout"><nobr><span class="asm-icon asm-icon-logout"></span> ' + _("Logout") + '</nobr></a></li>',
                    '</ul>',
                '</div>',
                '<div id="asm-topline-error" style="display: none" class="ui-widget">',
                    '<div class="ui-state-error ui-corner-all">',
                        '<p>',
                            '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>',
                            '<strong><span id="asm-topline-error-text"></span></strong>',
                        '</p>',
                    '</div>',
                '</div>',
                '<div id="asm-topline-info" style="display: none" class="ui-widget">',
                    '<div class="ui-state-highlight ui-corner-all">',
                        '<p>',
                            '<span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>',
                            '<strong><span id="asm-topline-info-text"></span></strong>',
                        '</p>',
                    '</div>',
                '</div>',
                '<div id="asm-topline-locked" style="display: none" class="ui-widget">',
                    '<div class="ui-state-error ui-corner-all">',
                        '<p>',
                            '<span class="ui-icon ui-icon-locked" style="float: left; margin-right: .3em;"></span>',
                            '<strong><span id="asm-topline-locked-text">',
                            _("This database is locked and in read-only mode. You cannot add, change or delete records."),
                            asm.smcom && asm.useraccount != "demo" ? ' ' + _("To continue using ASM, please renew {0}")
                                .replace("{0}", asm.smcompaymentlink) : "",
                            '</span></strong>',
                        '</p>',
                    '</div>',
                '</div>',
                '<div class="emergencynotice ui-widget" style="display: none">',
                    '<div class="ui-state-error ui-corner-all">',
                        '<p>',
                            '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>',
                            '<span class="emergencynoticetext"></span>',
                        '</p>',
                    '</div>',
                '</div>',
                '<div id="linkstips" class="no-print ui-state-highlight ui-corner-all" style="display: none; margin-top: 5px; padding-left: 5px; padding-right: 5px">',
                    '<p id="quicklinks" class="asm-quicklinks" style="display: none"><span class="ui-icon ui-icon-bookmark" style="float: left; margin-right: .3em;"></span>',
                        _("Quick Links"),
                        this.quicklinks_html(),
                    '</p>',
                    '<p id="tips" style="display: none"><span class="ui-icon ui-icon-lightbulb" style="float: left; margin-right: .3em"></span>',
                        '<span style="font-weight: bold">' + _("Did you know?") + '</span><br/>',
                        '<span id="tip"></span>',
                    '</p>',
                    '<p id="overtheme" style="display: none"><span class="ui-icon ui-icon-person" style="float: left; margin-right: .3em"></span>',
                        '<span>' + _("This theme has been set by your administrator. You can choose how the system looks for you with the Visual Theme option here: {0}")
                        .replace("{0}", '<a href="change_user_settings">' + _("Change User Settings") + '</a>'),
                        '</span>',
                    '</p>',
                '</div>',
                '<div id="dialog-textarea-zoom" style="display: none" title="">',
                    '<input id="textarea-zoom-id" type="hidden" />',
                    '<textarea id="textarea-zoom-area" style="width: 98%; height: 98%;"></textarea>',
                '</div>',
                '<div id="dialog-unsaved" style="display: none" title="' + _("Unsaved Changes") + '">',
                    '<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>',
                    _("You have unsaved changes, are you sure you want to leave this page?"),
                    '</p>',
                '</div>',
                '<div id="asm-topline-loading" style="display: none" title="' + _("Loading...") + '">',
                    '<p class="centered">',
                        '<img src="static/images/wait/wait32trans.gif" /><br />',
                    '</p>',
                    '<h2 class="centered" id="asm-topline-loading-text">' + _("Loading...") + '</h2>',
                '</div>',
                '<table id="header-fixed" class="no-print" style="position: fixed; top: 0px; display: none;"></table>'
            ];
            return h.join("");
        },

        bind: function() {
            
            var timezone = config.str("Timezone");
            if (timezone.indexOf("-") == -1) {
                timezone = "+" + timezone;
            }
            timezone += ":00";

            // Set flag icon
            $("#asm-topline-flag")
                .attr("src", "static/images/flags/" + asm.locale + ".png")
                .attr("title", asm.locale + " " + timezone);

            // Set user name
            $("#asm-topline-username").html(asm.user);

            // Deal with whether we're showing quicklinks and tips
            if (config.has() && common.current_url().indexOf("/main") != -1) {
                // Main screen
                if (config.bool("QuicklinksHomeScreen")) {
                    $("#linkstips").show();
                    $("#quicklinks").show();
                    $("#quicklinks").on("mouseover", "a", function() {
                        $(this).addClass("ui-state-hover");
                    });
                    $("#quicklinks").on("mouseout", "a", function() {
                        $(this).removeClass("ui-state-hover");
                    });

                }
                if (config.has() && !config.bool("DisableTips")) {
                    $("#tips").show();
                }
                if (config.has() && config.str("SystemTheme") == asm.theme && 
                    $.inArray(config.str("SystemTheme"), [ "smoothness", "ui-lightness" ]) == -1) {
                    $("#overtheme").show();
                }
            }
            else if (common.current_url().indexOf("/login") == -1) {
                // All other non-login screens
                if (config.bool("QuicklinksAllScreens")) {
                    $("#linkstips").show();
                    $("#quicklinks").show();
                    $("#quicklinks").on("mouseover", "a", function() {
                        $(this).addClass("ui-state-hover");
                    });
                    $("#quicklinks").on("mouseout", "a", function() {
                        $(this).removeClass("ui-state-hover");
                    });
                }
            }

            this.bind_search();

            // Hide the error and info boxes
            $("#asm-topline-error").hide();
            $("#asm-topline-info").hide();

            // Hide the My sheltermanager.com menu option for non-smcom and non-superusers
            if (!asm.smcom || !asm.superuser) {
                $("#asm-mysmcom").hide();
            }

            // If the database is locked, show it
            if (config.has() && config.bool("SMDBLocked")) {
                $("#asm-topline-locked").fadeIn().delay(20000).slideUp();
            }

            // If there's an emergency notice, show it
            try {
                if (controller && controller.emergencynotice) {
                    $(".emergencynoticetext").html(controller.emergencynotice);
                    $(".emergencynotice").fadeIn();
                }
            }
            catch(err) {} 
        },

        bind_search: function() {

            var keywords = [ "activelost", "activefound", "donors", "deceased", 
                "onshelter", "forpublish", "fosterers", "homecheckers", "members", "notforadoption", "staff", 
                "vets", "volunteers" ] ;
            var previous = common.local_get("asmsearch").split("|");
            var searches = keywords.concat(previous);

            var dosearch = function() {
                var term = $("#topline-q").val();
                // If we haven't seen this search term before, add it to our set
                if ($.inArray(term, previous) == -1) {
                    previous.push(term);
                    common.local_set("asmsearch", previous.join("|"));
                }
                window.location = "search?q=" + encodeURIComponent(term);
            };

            // Search autocompletes to keywords and previous searches
            $("#topline-q").autocomplete({ source: searches });

            // Pressing enter starts the search
            $("#topline-q").keypress(function(e) {
                if (e.which == 13) {
                    dosearch();
                    return false;
                }
            });

            // Set the font to a lighter colour in the search box
            // and remember the default text in there
            $("#topline-q").css("color", "#aaa");
            var defaultSearchText = $("#topline-q").val();
            
            // Remove the default text and change the colour on focus
            $("#topline-q").focus(function() {
                if ($("#topline-q").val() == defaultSearchText) {
                    $("#topline-q").css("color", "#000");
                    $("#topline-q").val("");
                }
            });

            // Restore the default search text when we lose the focus if empty
            $("#topline-q").focusout(function() {
                if ($("#topline-q").val() == "") {
                    $("#topline-q").css("color", "#aaa");
                    $("#topline-q").val(defaultSearchText);
                }
            });

            // If the option is on, show the go button for searching
            if (config.has() && config.bool("ShowSearchGo")) {
                $("#searchgo").show();
                $("#searchgo").click(function() {
                    dosearch();
                });
            }
        }

    };

    // Render the page header above any content in the body tag
    $("body").prepend(header.render());

    // Setup the menu widgets
    header.menu_widgets();
    header.bind();

    common.apply_label_overrides("topline");
    $("#asm-topline").show();

});
