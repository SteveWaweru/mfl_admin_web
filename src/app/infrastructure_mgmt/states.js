(function (angular) {
    "use strict";

    angular.module("mfl.infrastructure_mgmt.states", [
        "ui.router"
    ])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
        .state("infrastructure_mgmt", {
            parent: "setup",
            url: "/infrastructure/",
            views: {
                "main": {
                    controller: "mfl.infrastructure_mgmt.controllers.main",
                    templateUrl: "common/tpls/main.tpl.html"
                },
                "body@setup": {
                    templateUrl: "setup/tpls/dashboard/body.tpl.html"
                },
                "header@setup": {
                    controller: "mfl.common.controllers.header",
                    templateUrl: "common/tpls/header.tpl.html",
                }
            },
            data : { pageTitle: "Infrastracture Management" },
            permission: "facilities.view_service",
            // redirectTo: "infrastructure_mgmt.categories_list"
        })

        // =============== infrastructure categories ==============

        .state("infrastructure_mgmt.categories_list", {
            url: "categories/",
            views: {
                "body@setup": {
                    templateUrl: "setup/tpls/dashboard/body.tpl.html"
                },
                "main-content@infrastructure_mgmt.categories_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.categories_list",
                    templateUrl: "infrastructure_mgmt/tpls/categories_grid.tpl.html",
                }
            },
            cache: false,
            permission: "facilities.add_servicecategory"
        })

        .state("infrastructure_mgmt.categories_list.categories_create", {
            url: "create/",
            views: {
                "main-content@infrastructure_mgmt.categories_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.categories_create",
                    templateUrl: "infrastructure_mgmt/tpls/categories_edit.tpl.html"
                },
            },
            permission: "facilities.add_servicecategory",
            userFeature: "is_staff",
        })

        .state("infrastructure_mgmt.categories_list.categories_edit", {
            url: ":category_id/edit/",
            views: {
                "main-content@infrastructure_mgmt.categories_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.categories_edit",
                    templateUrl: "infrastructure_mgmt/tpls/categories_edit.tpl.html",
                }
            },
            permission: "facilities.add_servicecategory",
        })

        .state("infrastructure_mgmt.categories_list.categories_edit.delete", {
            url: "delete/",
            views: {
                "delete@infrastructure_mgmt.categories_list.categories_edit": {
                    controller: "mfl.infrastructure_mgmt.controllers.categories_edit",
                    templateUrl: "common/tpls/delete.tpl.html"
                }
            },
            permission: "facilties.delete_servicecategory",
            userFeature: "is_staff"
        })

        // ============ infrastructure ======================

        .state("infrastructure_mgmt.infrastructure_list", {
            url: "infrastructure/",
            views: {
                "body@setup": {
                    templateUrl: "setup/tpls/dashboard/body.tpl.html",
                },
                "main-content@infrastructure_mgmt.infrastructure_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.infrastructure_list",
                    templateUrl: "infrastructure_mgmt/tpls/infrastructure_grid.tpl.html"
                }
            },
            permission: "facilities.view_service"
        })

        .state("infrastructure_mgmt.infrastructure_list.infrastructure_create", {
            url: "create/",
            views: {
                "main-content@infrastructure_mgmt.infrastructure_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.infrastructure_create",
                    templateUrl: "infrastructure_mgmt/tpls/infrastructure_edit.tpl.html"
                }
            },
            permission: "facilities.add_service",
            userFeature: "is_staff"
        })

        .state("infrastructure_mgmt.infrastructure_list.infrastructure_edit", {
            url: ":infrastructure_id/edit/",
            views: {
                "main-content@infrastructure_mgmt.infrastructure_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.infrastructure_edit",
                    templateUrl: "infrastructure_mgmt/tpls/infrastructure_edit.tpl.html"
                }
            },
            permission: "facilities.view_service",
        })

        .state("infrastructure_mgmt.infrastructure_list.infrastructure_edit.delete", {
            url: "delete/",
            views: {
                "delete@infrastructure_mgmt.infrastructure_list.infrastructure_edit": {
                    controller: "mfl.infrastructure_mgmt.controllers.infrastructure_edit",
                    templateUrl: "common/tpls/delete.tpl.html"
                }
            },
            permission: "facilties.delete_servicecategory",
            userFeature: "is_staff"
        });

    }])

})(window.angular)