(function (angular) {
    "use strict";

    angular.module("mfl.facility_mgmt.states.create", [
        "ui.router"
    ])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("facilities.facility_create", {
                url: "create/?furthest",
                views : {
                    "main-content@facility_mgmt": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_create"
                    }
                },
                redirectTo: "facilities.facility_create.basic",
                permission: "facilities.add_facility"
            })

            .state("facilities.facility_create.basic", {
                url: "basics/:facility_id",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.basic.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.basic"
                    }
                },
                permission: "facilities.add_facility"
            })

            .state("facilities.facility_create.contacts", {
                url: ":facility_id/contacts/",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.contacts.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.contacts"
                    }
                },
                permission: "facilities.add_facility"
            })
            // facility service creation
            .state("facilities.facility_create.services", {
                url: ":facility_id/services/",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.services.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.services"
                    }
                },
                redirectTo : "facilities.facility_create.services.edit",
                permission: "facilities.add_facility"
            })
            .state("facilities.facility_create.humanresources", {
                url: ":facility_id/humanresources/",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_hr/facility_edit.hr.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facilities.hr"
                    }
                },
                redirectTo : "facilities.facility_create.humanresources.edit",
                permission: "facilities.add_facility"
            })

            .state("facilities.facility_create.services.view", {
                url: "view/",
                views: {
                    "service-content@facilities.facility_create.services": {
                        templateUrl : "facility_mgmt/tpls/facility_services.view.tpl.html"
                    }
                }
            })

            .state("facilities.facility_create.services.edit", {
                url : "edit/",
                views : {
                    "service-content@facilities.facility_create.services": {
                        templateUrl : "facility_mgmt/tpls/facility_services.edit.tpl.html"
                    }
                }
            })
            // facility infra creation
            .state("facilities.facility_create.infrastructure", {
                url: ":facility_id/infrastructure/",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_infrastructure/facility_edit.infrastructure.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facilities.infrastructure"
                    }
                },
                redirectTo : "facilities.facility_create.infrastructure.edit",
                permission: "facilities.add_facility"
            })
            .state("facilities.facility_create.humanresources.view", {
                url: "view/",
                views: {
                    "service-content@facilities.facility_create.humanresources": {
                        templateUrl : "facility_mgmt/tpls/facility_hr/facility_hr.view.tpl.html"
                    }
                }
            })
            .state("facilities.facility_create.infrastructure.view", {
                url: "view/",
                views: {
                    "service-content@facilities.facility_create.infrastructure": {
                        templateUrl : "facility_mgmt/tpls/facility_infrastructure/facility_infrastructure.view.tpl.html"
                    }
                }
            })
            .state("facilities.facility_create.infrastructure.edit", {
                url: "edit/",
                views: {
                    "service-content@facilities.facility_create.infrastructure": {
                        templateUrl : "facility_mgmt/tpls/facility_infrastructure/facility_infrastructure.edit.tpl.html"
                    }
                }
            })
            .state("facilities.facility_create.humanresources.edit", {
                url: "edit/",
                views: {
                    "service-content@facilities.facility_create.humanresources": {
                        templateUrl : "facility_mgmt/tpls/facility_hr/facility_hr.edit.tpl.html"
                    }
                }
            })

            .state("facilities.facility_create.setup", {
                url: ":facility_id/setup",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.setup.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.setup"
                    }
                },
                permission: "facilities.add_facility"
            })

            .state("facilities.facility_create.units", {
                url: ":facility_id/units/",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.units.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.units"
                    }
                },
                permission: "facilities.add_facility"
            })

            .state("facilities.facility_create.location", {
                url: ":facility_id/location",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.location.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.location"
                    }
                },
                permission: "facilities.add_facility"
            })

            .state("facilities.facility_create.geolocation", {
                url: ":facility_id/geolocation/",
                views: {
                    "tab-header@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_create.tab-headers.tpl.html"
                    },
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_edit.geolocation.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_edit.geolocation"
                    }
                },
                permission: "facilities.add_facility"
            })

            .state("facilities.facility_create.facility_cover_letter", {
                url: ":facility_id/print/",
                views : {
                    "form-view@facilities.facility_create": {
                        templateUrl: "facility_mgmt/tpls/facility_print.tpl.html",
                        controller: "mfl.facility_mgmt.controllers.facility_create.facility_print"
                    }
                },
                permission: "facilities.view_facility"
            });
    }]);

})(window.angular);
