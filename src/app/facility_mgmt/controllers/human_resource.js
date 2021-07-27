(function (angular) {
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
                function ($log, wrappers, errorMessages, $state, toasty, $stateParams) {
                    var loadData = function ($scope) {
                        // fetching services
                        wrappers.hr.filter({ page_sizE: 100, ordering: "name" })
                            .success(function (data) {
                                $scope.hr = data.results;
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMEssages.errors +
                                    errorMessages.fetching_services;
                            });

                        wrappers.hr_categories.filter({ "fields": "id,name" })
                            .success(function (data) {
                                $scope.hr_categories = data.results;
                            })
                            .error(function (err) {
                                $scope.alert = err.error;
                            });
                    };

                    this.bootstrap = function ($scope) {
                        loadData($scope);
                        $scope.new_service = {
                            service: "",
                            count: "",
                        };
                        $scope.changeView = function (name) {
                            if ($scope.create) {
                                $state.go("facilities.facility_create.hr." + name,
                                    {
                                        furthest: $scope.furthest,
                                        facility_id: $scope.new_facility
                                    });
                            } else {
                                $state.go("facilities.facility_edit.hr." + name);
                            }
                        }
                        $scope.showHR = function (cat) {
                            if (cat.selected === false) {
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
                                { "category": cat.id });
                        }
                        $scope.hr = [];
                        $scope.fac_hr = {
                            specialities : []
                        };
                        $scope.hr_display = [];
                        $scope.removeOption = function (hr_obj) {
                            if(_.isUndefined(hr_obj.fac_hr)){
                                hr_obj.option = "";
                                $scope.hr_display = _.without($scope.hr_display, hr_obj);
                            }else{
                                wrappers.facility_hr.remove(hr_obj.fac_hr)
                                .success(function () {
                                    toasty.success({
                                        title: "Facility Specialities",
                                        msg: "Speciality successfully deleted"
                                    });
                                    hr_obj.option = "";
                                })
                                .error(function (data) {
                                    $scope.errors = data;
                                });
                            }
                        };
                        $scope.hrDisplay = function (obj) {
                            if(_.where($scope.facility_hr, obj).length > 0) {
                                if(_.isEmpty(obj.option) || _.isUndefined(obj.option)){
                                    $scope.facility_hr = _.without($scope.facility_hr, obj);
                                }
                            }else{
                                if(!_.isEmpty(obj.option) || obj.option === true){
                                    $scope.facility_hr.push(obj);
                                }
                            }
                        };
                        $scope.facilityHR = function () {
                            _.each($scope.hr, function (hr_obj) {
                                if (!_.isUndefined(hr_obj.option) &&
                                    !_.isEmpty(hr_obj.option)) {
                                    $scope.fac_hr.specialities.push({
                                        speciality : hr_obj.id,
                                        option : hr_obj.option
                                    });
                                }
                                if (!_.isUndefined(hr_obj.option) &&
                                    hr_obj.option === true) {
                                    $scope.fac_hr.specialities.push({
                                        speciality : hr_obj.id
                                    });
                                }
                            });
                            _.each($scope.facility.hr,
                                function (facility_hr1) {
                                    var obj = _.findWhere($scope.fac_hr.specialities,
                                        { "speciality": facility_hr1.id });
                                    $scope.fac_hr.specialities =
                                        _.without($scope.fac_hr.specialities, obj);
                            });
                            let update_payload = {"specialities":[]}
                            _.each(_.filter($scope.hr, function (obj) {
                                return obj.present === true;
                            }), function (upd) {
                                update_payload.specialities.push({"speciality":upd.id});
                            })
                            wrappers.facilities.update($scope.facility_id,
                                update_payload
                                )
                                .success(function () {
                                    if (!$scope.create) {
                                        $scope.prompt_msg = true;
                                    } else {
                                        $state.go("facilities.facility_create." +
                                            "facility_cover_letter", {
                                                facility_id:
                                                    $scope.new_facility
                                        }, { reload: true });
                                    }
                                })
                                .error(function (err) {
                                    $scope.errors = err.error;
                                });
                        };
                        $scope.upgradePrompt = function () {
                            var update_msg = {
                                title : "Facility Updated",
                                msg : "Facility successfully updated"
                            };
                            toasty.success(update_msg);
                            if($scope.facility.approved){
                                $state.go("facilities.facility_view_changes",
                                    {facility_id: $stateParams.facility_id});
                            }
                            else{
                                $state.go("facilities");
                            }
        
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
            "$scope", "$controller", function ($scope, $controller) {
                var helper = $controller("mfl.facility_mgmt.controllers.hr_helper");
                helper.bootstrap($scope);
                if ($scope.create) {
                    $scope.nextState();
                    $scope.$parent.print = false;
                }
                $scope.filters = { facility: $scope.facility_id };
            }]
        );

})(window.angular);