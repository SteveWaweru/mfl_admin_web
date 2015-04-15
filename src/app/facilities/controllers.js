"use strict";

angular.module("mfl.facilities.controllers", [])

    .controller("mfl.facilities.controllers.services", ["$scope",  "mfl.services.services.services",
    function ($scope, serviceServices) {
        $scope.test = "Services";
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "Manage services",
                route: "facilities.manage_services"
            }
        ];
        $scope.title = [
            {
                icon: "fa-exchange",
                name: "Manage services"
            }
        ];
        $scope.action = [
            {
                func : "ui-sref='facilities.new_service' ",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "New Service",
                icon: "fa-plus"
            },
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
        $scope.services = serviceServices.getServices();
    }])
    //start of new and edit services
    .controller("mfl.facilities.controllers.new_service", ["$scope", function ($scope) {
        $scope.test = "New service";
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "Manage services",
                route: "facilities.manage_services"
            },
            {
                name: "New Service",
                route: "services.new_service"
            }
        ];
        $scope.title = [
            {
                icon: "fa-plus-circle",
                name: "New Service"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
    }])
    .controller("mfl.facilities.controllers.edit_service", ["$scope", function ($scope) {
        $scope.test = "Edit service";
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "Manage services",
                route: "facilities.manage_services"
            },
            {
                name: "Edit Service",
                route: "services.edit_service"
            }
        ];
        $scope.title = [
            {
                icon: "fa-edit",
                name: "Edit Service"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
    }])
    .controller("mfl.facilities.controllers.view_service", ["$scope",
    "mfl.services.services.services", "$stateParams",
    function ($scope, serviceServices, $stateParams) {
        $scope.test = "View service";
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "Manage services",
                route: "facilities.manage_services"
            },
            {
                name: "View Service",
                route: "services.view_service"
            }
        ];
        $scope.title = [
            {
                icon: "fa-eye",
                name: "View Service"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];

        $scope.services = serviceServices.getServices();
        console.log($scope.services);
        $scope.getOneService = function () {
            $scope.oneService = _.findWhere(
                $scope.services.results, {"id" : $stateParams.service_id});
            return $scope.oneService;
        };
    }])
    //end of new and edit services
    .controller("mfl.facilities.controllers.facilities", ["$scope",
    function ($scope) {
        $scope.test = "Facilities sub-menu";
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            }
        ];
        $scope.title = [
            {
                icon: "fa-building",
                name: "Facilities"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
    }])

    .controller("mfl.facilities.controllers.manage_facilities", ["$scope",
    "mfl.facilities.services.facilities", function ($scope, facilityService) {
        $scope.test = "Facilities";
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "Manage facilities",
                route: "facilities.manage_facilities"
            }
        ];
        $scope.title = [
            {
                icon: "fa-building",
                name: "Manage facilities"
            }
        ];
        $scope.action = [
            {
                func : "ui-sref='facilities.new_facility' ",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "New Facility",
                icon: "fa-plus"
            },
            {
                func : "",
                class: "action-btn action-btn-md action-btn-warm ",
                color: "blue",
                tipmsg: "Publish Facilities",
                icon: "fa-tag"
            },
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
        $scope.facilities = facilityService.getFacilities();
    }])
    .controller("mfl.facilities.controllers.facilitiesaction", ["$scope", "$stateParams",
    "mfl.facilities.services.facilities", function ($scope, $stateParams,facilityService) {
        $scope.test = "Process Facilities";
        $scope.oneFacility = "";
        $scope.facilities = facilityService.getFacilities();
        $scope.results = $scope.facilities.results;
        $scope.getOnefacility = function () {
            $scope.oneFacility = _.findWhere($scope.results, {"id" : $stateParams.fac_id});
            return $scope.oneFacility;
        };
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "Process Facility",
                route: "facilities.facility_action"
            }
        ];
        $scope.title = [
            {
                icon: "fa-th",
                name: "Process Facility "
            }
        ];
        $scope.action = [
            {
                func : " ",
                class: "action-btn action-btn-md action-btn-success ",
                color: "blue",
                tipmsg: "New Facility",
                icon: "fa-check"
            },
            {
                func : " ",
                class: "action-btn action-btn-md action-btn-danger ",
                color: "blue",
                tipmsg: "New Facility",
                icon: "fa-close"
            },
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
    }])
    .controller("mfl.facilities.controllers.new_facility", ["$scope", function ($scope) {
        $scope.test = "New facilities";
        $scope.setter = false;
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "New Facility",
                route: "facilities.new_facility"
            }
        ];
        $scope.title = [
            {
                icon: "fa-plus-circle",
                name: "New facility"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
        //facility contacts
        $scope.facility = {
            contacts : [
                {
                    contact_type: "",
                    contact: ""
                }
            ]
        };
        //adding contacts
        $scope.addContact = function () {
            $scope.facility.contacts.push({contact_type: "", contact: ""});
        };
        //removing contacts
        $scope.removeContact = function (obj) {
            $scope.facility.contacts = _.without($scope.facility.contacts, obj);
        };
    }])
    .controller("mfl.facilities.controllers.edit_facility", ["$scope", "$stateParams",
    "mfl.facilities.services.facilities", function ($scope, $stateParams, facilityService) {
        $scope.test="Edit facility";
        $scope.setter = true;
        $scope.facilities = facilityService.getFacilities();
        $scope.facility = _.findWhere($scope.facilities, {id : $stateParams.fac_id});
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "Edit Facility",
                route: "facilities.edit_facility.basic"
            }
        ];
        $scope.title = [
            {
                icon: "fa-edit",
                name: "Edit facility"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
    }])
    .controller("mfl.facilities.controllers.new_owner", ["$scope", function ($scope) {
        $scope.test = "New owner";
        $scope.path = [
            {
                name: "Facilities",
                route: "facilities"
            },
            {
                name: "New owner",
                route: "facilities.new_owner"
            }
        ];
        $scope.title = [
            {
                icon: "fa-user-secret",
                name: "New Owner"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
    }]);
