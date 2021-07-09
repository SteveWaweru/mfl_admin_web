(function(angular) {
    "use strict";

    /**
     * @ngdoc module
     * 
     * @name mfl.facility_mgmt.controllers.hr
     * 
     * @description
     * Module containing controllers for facility human resources
     */

    angular.module("mfl.facility_mgmt.controllers.hr", [
        "mfl.facility_mgmt.services",
        "mfl.common.forms",
        "720kb.datepicker",
        "mfl.common.constants",
        "nemLogging",
        "angular-toasty",
        "mfl.common.filters"
    ])

    /**
     * @ngdoc controller
     * 
     * @name mfl.facility_mgmt.controllers.hr_helper
     * 
     * @description
     * The helper controller to manage services in add/edit a facility
     */

    .controller("mfl.facility_mgmt.controllers.hr_helper", 
        ["$log", "mfl.facility_mgmt.services.wrappers", "mfl.error.messages",
        "$state", "toasty", "$stateParams",
        function($log, wrappers, errorMessages, $state, toasty, $stateParams) {
            var loadData = function ($scope) {
                // fetching services
                wrappers.hr.filter({page_sizE: 100, ordering: "name"})
                .success(function(data) {
                    $scope.hr = data.results;
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.service_error = errorMEssages.errors +
                        errorMessages.fetching_services;
                });

                wrappers.hr_categories.filter({"fields": "id,name"})
                .success(function (data) {
                    $scope.hr_categories = data.results;
                })
                .error(function (err) {
                    $scope.alert = err.error;
                });
            };

            this.bootstrap = function($scope) {
                loadData($scope);
                $scope.new_service = {
                    service: "",
                    count: "",
                };
                $scope.changeView = function (name) {
                    if ($scope.create) {
                        $state.go("facilities.facility_create.hr."+name,
                            {
                                furthest: $scope.furthest, 
                                facility_id: $scope.new_facility
                            });
                    } else {
                        $state.go("facilities.facility_edit.hr."+name);
                    }
                }
                $scope.showServices = function(cat) {
                    if(cat.selected === false) {
                        cat.selected = true;
                    } else {
                        cat.selected = true;
                    }
                    _.each($scope.hr_categories, function (one_cat) {
                        if (one_cat.selected === true &&
                            one_cat.id !== cat.id) {
                            one_cat.selected = !one_cat.selected;
                        }
                    });
                    $scope.cat_hr = _.where($scope.hr,
                        { "category": cat.id});
                }
                $scope.hr = [];
                $scope.facilityServices = function () {
                    _.each($scope.services, function (service_obj) {
                        if(!_.isUndefined(service_obj.option) &&
                            !_.isEmpty(service_obj.option)) {
                            $scope.fac_serv.services.push({
                                service : service_obj.id,
                                option : service_obj.option
                            });
                        }
                        if(!_.isUndefined(service_obj.option) &&
                            service_obj.option === true){
                            $scope.fac_serv.services.push({
                                service : service_obj.id
                            });
                        }
                    });
                    _.each($scope.facility.hr,
                        function (facility_hr1) {
                            var obj = _.findWhere($scope.fac_serv.services,
                                {"service" : facility_hr1.service_id});
                            $scope.fac_serv.services =
                                _.without($scope.fac_serv.services, obj);
                        });
                    wrappers.facilities.update($scope.facility_id,
                        $scope.fac_serv)
                        .success(function () {
                            if(!$scope.create){
                                $scope.prompt_msg = true;
                            }else{
                                $state.go("facilities.facility_create."+
                                    "facility_cover_letter", {facility_id :
                                    $scope.new_facility}, {reload : true});
                            }
                        })
                        .error(function (err) {
                            $scope.errors = err.error;
                        });
                };
            }
        }]
    )

    /**
     * @ngdoc controller
     * 
     * @name mfl.facility_mgmt.controllers.hr
     * 
     * @description
     * Handles listing of facilities' human resources summary
     */
    .controller("mfl.facility_mgmt.controllers.facilities.hr", [
        "$scope", "$controller", function($scope, $controller) {
            var helper = $controller("mfl.facility_mgmt.controllers.hr_helper");
            helper.bootstrap($scope);
            if($scope.create) {
                $scope.nextState();
                $scope.$parent.print = false;
            }
            $scope.filters = {facility: $scope.facility_id};
        }]
    );

})(window.angular);