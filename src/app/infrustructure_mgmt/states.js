(function (angular) {
    "use strict";

    angular.module("mfl.infrastructure_mgmt.states", [
        "ui.router"
    ])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
        .state("infrastructure_mgmt", {
            parent: "setup",
            url: "/infrustructure/",
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
            }
        })

        // =============== infrustructure categories ==============

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

        .state("infrastructure_mgmt.categories_list.category_create", {
            url: "create/",
            view: {
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
            permission: "facilities.view_servicecategories",
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

        // ============ infrustructure ======================

        .state("infrastructure_mgmt.infrustructure_list", {
            url: "infrustructure/",
            views: {
                "body@setup": {
                    templateUrl: "setup/tpls/dashboard/body.tpl.html",
                },
                "main-content@infrastructure_mgmt.infrustructure_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.infrustructure_list",
                    templateUrl: "infrastructure_mgmt/tpls/infrustructure_list.tpl.html"
                }
            },
            permission: "facilities.view_service"
        })

        .state("infrastructure_mgmt.infrustructure_list.infrustructure_create", {
            url: "create/?furthest",
            views: {
                "main-content@infrastructure_mgmt.infrustructure_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.infrustructure_create",
                    templateUrl: "infrastructure_mgmt/tpls/infrustructure_create.tpl.html"
                }
            },
            permission: "facilities.add_service",
            userFeature: "is_staff"
        })

        .state("infrastructure_mgmt.infrustructure_list.infrustructure_edit", {
            url: ":infrastructure_id/edit/",
            views: {
                "main-content@infrastructure_mgmt.infrustructure_list": {
                    controller: "mfl.infrastructure_mgmt.controllers.infrustructure_edit",
                    templateUrl: "infrastructure_mgmt/tpls/infrustructure_edit.tpl.html"
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