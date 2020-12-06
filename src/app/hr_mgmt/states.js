(function (angular) {
    "use strict";

    angular.module("mfl.hr_mgmt.states", [
        "ui.router"
    ])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
        .state("hr_mgmt", {
            parent: "setup",
            url: "/hr/",
            views: {
                "main": {
                    controller: "mfl.hr_mgmt.controllers.main",
                    templateUrl: "common/tpls/main.tpl.html"
                },
                "body@setup": {
                    templateUrl: "setup/tpls/dashboard/body.tpl.html"
                },
                "header@setup": {
                    controller: "mfl.common.controllers.header",
                    templateUrl: "common/tpls/header.tpl.html",
                }
            }
        })

        // =============== infrustructure categories ==============

        .state("hr_mgmt.categories_list", {
            url: "categories/",
            views: {
                "body@setup": {
                    templateUrl: "setup/tpls/dashboard/body.tpl.html"
                },
                "main-content@hr_mgmt.categories_list": {
                    controller: "mfl.hr_mgmt.controllers.categories_list",
                    templateUrl: "hr_mgmt/tpls/categories_grid.tpl.html",
                }
            },
            cache: false,
            permission: "facilities.add_servicecategory"
        })

        .state("hr_mgmt.categories_list.categories_create", {
            url: "create/",
            views: {
                "main-content@hr_mgmt.categories_list": {
                    controller: "mfl.hr_mgmt.controllers.categories_create",
                    templateUrl: "hr_mgmt/tpls/categories_edit.tpl.html"
                },
            },
            permission: "facilities.add_servicecategory",
            userFeature: "is_staff",
        })

        .state("hr_mgmt.categories_list.categories_edit", {
            url: ":category_id/edit/",
            views: {
                "main-content@hr_mgmt.categories_list": {
                    controller: "mfl.hr_mgmt.controllers.categories_edit",
                    templateUrl: "hr_mgmt/tpls/categories_edit.tpl.html",
                }
            },
            permission: "facilities.view_servicecategories",
        })

        .state("hr_mgmt.categories_list.categories_edit.delete", {
            url: "delete/",
            views: {
                "delete@hr_mgmt.categories_list.categories_edit": {
                    controller: "mfl.hr_mgmt.controllers.categories_edit",
                    templateUrl: "common/tpls/delete.tpl.html"
                }
            },
            permission: "facilties.delete_servicecategory",
            userFeature: "is_staff"
        })

        // ============ infrustructure ======================

        .state("hr_mgmt.specialists_list", {
            url: "specialists/",
            views: {
                "body@setup": {
                    templateUrl: "setup/tpls/dashboard/body.tpl.html",
                },
                "main-content@hr_mgmt.specialists_list": {
                    controller: "mfl.hr_mgmt.controllers.specialists_list",
                    templateUrl: "hr_mgmt/tpls/specialists_grid.tpl.html"
                }
            },
            permission: "facilities.view_service"
        })

        .state("hr_mgmt.specialists_list.specialists_create", {
            url: "create/?furthest",
            views: {
                "main-content@hr_mgmt.specialists_list": {
                    controller: "mfl.hr_mgmt.controllers.specialists_create",
                    templateUrl: "hr_mgmt/tpls/specialists_edit.tpl.html"
                }
            },
            permission: "facilities.add_service",
            userFeature: "is_staff"
        })

        .state("hr_mgmt.specialists_list.specialists_edit", {
            url: ":specialist_id/edit/",
            views: {
                "main-content@hr_mgmt.specialists_list": {
                    controller: "mfl.hr_mgmt.controllers.specialists_edit",
                    templateUrl: "hr_mgmt/tpls/specialists_edit.tpl.html"
                }
            },
            permission: "facilities.view_service",
        })

        .state("hr_mgmt.specialists_list.specialists_edit.delete", {
            url: "delete/",
            views: {
                "delete@hr_mgmt.specialists_list.specialists_edit": {
                    controller: "mfl.hr_mgmt.controllers.specialists_edit",
                    templateUrl: "common/tpls/delete.tpl.html"
                }
            },
            permission: "facilties.delete_servicecategory",
            userFeature: "is_staff"
        });

    }])

})(window.angular)