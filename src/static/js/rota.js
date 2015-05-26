/*jslint browser: true, forin: true, eqeq: true, white: true, sloppy: true, vars: true, nomen: true */
/*global $, jQuery, _, asm, common, config, controller, dlgfx, edit_header, format, header, html, tableform, validate */

$(function() {

    var rota = {

        model: function() {
            var dialog = {
                add_title: _("Add rota item"),
                edit_title: _("Edit rota item"),
                edit_perm: 'coro',
                close_on_ok: false,
                columns: 1,
                width: 550,
                fields: [
                    { json_field: "OWNERID", post_field: "person", personmode: "brief", personfilter: "volunteerandstaff", 
                        label: _("Person"), type: "person", validation: "notzero" },
                    { json_field: "ROTATYPEID", post_field: "type", label: _("Type"), type: "select", options: { displayfield: "ROTATYPE", valuefield: "ID", rows: controller.rotatypes }},
                    { json_field: "STARTDATETIME", post_field: "startdate", label: _("Starts"), type: "date", validation: "notblank", defaultval: new Date() },
                    { json_field: "STARTDATETIME", post_field: "starttime", label: _("at"), type: "time", validation: "notblank", defaultval: config.str("DefaultShiftStart") },
                    { json_field: "ENDDATETIME", post_field: "enddate", label: _("Ends"), type: "date", validation: "notblank", defaultval: new Date() },
                    { json_field: "ENDDATETIME", post_field: "endtime", label: _("at"), type: "time", validation: "notblank", defaultval: config.str("DefaultShiftEnd") },
                    { json_field: "COMMENTS", post_field: "comments", label: _("Comments"), type: "textarea" }
                ]
            };

            var table = {
                rows: controller.rows,
                idcolumn: "ID",
                edit: function(row) {
                    tableform.dialog_show_edit(dialog, row)
                        .then(function() {
                            tableform.fields_update_row(dialog.fields, row);
                            row.OWNERNAME = $("#person").personchooser("get_selected").OWNERNAME;
                            row.ROTATYPENAME = common.get_field(controller.rotatypes, row.ROTATYPEID, "ROTATYPE");
                            return tableform.fields_post(dialog.fields, "mode=update&rotaid=" + row.ID, controller.name);
                        })
                        .then(function(response) {
                            tableform.table_update(table);
                            tableform.dialog_close();
                        })
                        .fail(function() {
                            tableform.dialog_enable_buttons();
                        });
                },
                columns: [
                    { field: "ROTATYPENAME", display: _("Type") },
                    { field: "PERSON", display: _("Person"),
                        formatter: function(row) {
                            if (row.OWNERID) {
                                return edit_header.person_link(row, row.OWNERID);
                            }
                            return "";
                        },
                        hideif: function(row) {
                            return controller.name.indexOf("person_") != -1;
                        }
                    },
                    { field: "STARTDATETIME", display: _("Start Time"), formatter: tableform.format_datetime, initialsort: true, initialsortdirection: "desc" },
                    { field: "ENDDATETIME", display: _("End Time"), formatter: tableform.format_datetime },
                    { field: "COMMENTS", display: _("Comments") }
                ]
            };

            var buttons = [
                 { id: "new", text: _("New"), icon: "new", enabled: "always", perm: "aoro",
                     click: function() { 
                         $("#person").personchooser("clear");
                         if (controller.person) {
                             $("#person").personchooser("loadbyid", controller.person.ID);
                         }
                         tableform.dialog_show_add(dialog)
                             .then(function() {
                                return tableform.fields_post(dialog.fields, "mode=create", controller.name);
                             })
                             .then(function(response) {
                                 var row = {};
                                 row.ID = response;
                                 tableform.fields_update_row(dialog.fields, row);
                                 row.OWNERNAME = $("#person").personchooser("get_selected").OWNERNAME;
                                 row.ROTATYPENAME = common.get_field(controller.rotatypes, row.ROTATYPEID, "ROTATYPE");
                                 controller.rows.push(row);
                                 tableform.table_update(table);
                                 tableform.dialog_close();
                             })
                             .fail(function() {
                                 tableform.dialog_enable_buttons();
                             });
                     } 
                 },
                 { id: "delete", text: _("Delete"), icon: "delete", enabled: "multi", perm: "doro",
                     click: function() { 
                         tableform.delete_dialog()
                             .then(function() {
                                 tableform.buttons_default_state(buttons);
                                 var ids = tableform.table_ids(table);
                                 return common.ajax_post(controller.name, "mode=delete&ids=" + ids);
                             })
                             .then(function() {
                                 tableform.table_remove_selected_from_json(table, controller.rows);
                                 tableform.table_update(table);
                             });
                     } 
                 }
            ];
            this.dialog = dialog;
            this.table = table;
            this.buttons = buttons;

        },

        render: function() {
            var s = "";
            this.model();
            s += tableform.dialog_render(this.dialog);
            if (controller.name.indexOf("person_rota") == 0) {
                s += edit_header.person_edit_header(controller.person, "rota", controller.tabcounts);
            }
            else {
                s += html.content_header(controller.title);
            }
            s += tableform.buttons_render(this.buttons);
            s += tableform.table_render(this.table);
            s += html.content_footer();
            return s;
        },

        bind: function() {
            $(".asm-tabbar").asmtabs();
            tableform.dialog_bind(this.dialog);
            tableform.buttons_bind(this.buttons);
            tableform.table_bind(this.table, this.buttons);
            $("#startdate").change(function() {
                $("#enddate").val($("#startdate").val());
            });
        },

        destroy: function() {
            common.widget_destroy("#person");
            tableform.dialog_destroy();
        },

        name: "rota",
        animation: "formtab",
        title: function() {
            if (controller.name == "person_rota") {
                return controller.person.OWNERNAME;
            }
        },
        routes: {
            "person_rota": function() { common.module_loadandstart("rota", "person_rota?id=" + this.qs.id); }
        }

    };

    common.module_register(rota);

});
