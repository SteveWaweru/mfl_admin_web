(function (angular) {
    "use strict";

    angular.module("mfl.facility_mgmt.states.edit", [
        "ui.router"
    ])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("facilities.facility_view", {
                url: "view/:facility_id/",
                views: {
                    "main-content@facility_mgmt": {
                        templateUrl: "facility_mgmt/tpls/facility_view.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_create.facility_print"
                    },
                    "read-only@facilities.facility_view": {
                        templateUrl: "facility_mgmt/tpls/facility_print.tpl.html"
                    }
                },
                permission: "facilities.view_facility"
            })
            .state("facilities.facility_view.close", {
                url: "close/",
                views: {
                    "delete@facilities.facility_view": {
                        templateUrl: "facility_mgmt/tpls/facility_edit_close.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.close"
                    }
                },
                permission: "facilities.view_closed_facilities"
            })
            .state("facilities.facility_view.open", {
                url: "open/",
                views: {
                    "delete@facilities.facility_view": {
                        templateUrl: "facility_mgmt/tpls/facility_edit_open.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.close"
                    }
                },
                permission: "facilities.view_closed_facilities"
            })
            .state("facilities.facility_edit", {
                url: "edit/:facility_id/",
                views: {
                    "main-content@facility_mgmt": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit"
                    }
                },
                redirectTo: "facilities.facility_edit.basic",
                permission: "facilities.view_facility"
            })

            .state("facilities.facility_edit.delete", {
                url: "delete/",
                views: {
                    "delete@facilities.facility_edit": {
                        templateUrl: "common/tpls/delete.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit"
                    }
                },
                permission: "facilities.delete_facility"
            })

            .state("facilities.facility_edit.basic", {
                url: "basic/",
                views: {
                    "tab-header@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.basic.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.basic"
                    }
                },
                permission: "facilities.view_facility"
            })

            .state("facilities.facility_edit.contacts", {
                url: "contacts/",
                views: {
                    "tab-header@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.contacts.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.contacts"
                    }
                },
                permission: "facilities.view_facility"
            })
            .state("facilities.facility_edit.services", {
                url: "services/",
                views: {
                    "tab-header@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.services.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.services"
                    }
                },
                redirectTo : "facilities.facility_edit.services.view",
                permission: "facilities.view_facility"
            })
            .state("facilities.facility_edit.services.view", {
                url: "view/",
                views: {
                    "service-content@facilities.facility_edit.services": {
                        templateUrl : "facility_mgmt/tpls/facility_services.view.tpl.html"
                    }
                }
            })
            .state("facilities.facility_edit.services.edit", {
                url : "edit/",
                views : {
                    "service-content@facilities.facility_edit.services": {
                        templateUrl : "facility_mgmt/tpls/facility_services.edit.tpl.html"
                    }
                }
            })
            // facility infrastructure
            .state("facilities.facility_edit.infrastructure", {
                url: "infrastructure/",
                views: {
                    "tab-header@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_infrastructure/facility_edit.infrastructure.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facilities.infrastructure"
                    }
                },
                redirectTo: "facilities.facility_edit.infrastructure.view",
                permission: "facilities.view_facility"
            })
            .state("facilities.facility_edit.infrastructure.view", {
                url: "view/",
                views: {
                    "service-content@facilities.facility_edit.infrastructure": {
                        templateUrl: "facility_mgmt/tpls/facility_infrastructure/facility_infrastructure.view.tpl.html"
                    }
                }
            })
            .state("facilities.facility_edit.infrastructure.edit", {
                url: "edit/",
                views: {
                    "service-content@facilities.facility_edit.infrastructure": {
                        templateUrl: "facility_mgmt/tpls/facility_infrastructure/facility_infrastructure.edit.tpl.html"
                    }
                }
            })
            // facility human resource
            .state("facilities.facility_edit.hr", {
                url: "humanresources/",
                views: {
                    "tab-header@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_hr/facility_edit.hr.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facilities.hr"
                    }
                },
                redirectTo: "facilities.facility_edit.hr.view",
                permission: "facilities.view_facility"
            })
            .state("facilities.facility_edit.hr.view", {
                url: "view/",
                views: {
                    "service-content@facilities.facility_edit.hr": {
                        templateUrl: "facility_mgmt/tpls/facility_hr/facility_hr.view.tpl.html"
                    }
                }
            })
            .state("facilities.facility_edit.hr.edit", {
                url: "edit/",
                views: {
                    "service-content@facilities.facility_edit.hr": {
                        templateUrl: "facility_mgmt/tpls/facility_hr/facility_hr.edit.tpl.html"
                    }
                }
            })
            // start of service prompt
            .state("facilities.facility_edit.services.view.prompt", {
                url  : "upgradeprompt/",
                views : {
                    "upgrade-prompt@facilities.facility_edit.services.view": {
                        templateUrl : "facility_mgmt/tpls/facility_upgrade_prompt.tpl.html"
                    }
                }
            })
            .state("facilities.facility_edit.units", {
                url: "units/",
                views: {
                    "tab-header@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.units.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.units"
                    }
                },
                permission: "facilities.view_facility"
            })
            .state("facilities.facility_edit.setup", {
                url: "setup/",
                views: {
                    "tab-header@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.setup.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.setup"
                    }
                },
                permission: "facilities.view_facility"
            })

            .state("facilities.facility_edit.geolocation", {
                url: "geolocation/",
                views: {
                    "tab-header@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_edit": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.geolocation.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.geolocation"
                    }
                },
                permission: "facilities.view_facility"
            })

            .state("facilities.facility_view_changes", {
                url: "facility_changes/:facility_id/",
                views: {
                    "main-content@facility_mgmt": {
                        templateUrl: "facility_mgmt/tpls/facility.preview_changes.tpl.html",
                        controller: "mfl.facilities.preview_changes"
                    }
                },
                permission: "facilities.view_facility"
            });
    }]);

})(window.angular);
